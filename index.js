require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const express = require("express");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("passport");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "change_this_secret";
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const APP_BASE_URL = String(process.env.APP_BASE_URL || "").trim();

const SMTP_HOST = String(process.env.SMTP_HOST || "").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 0);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = String(process.env.SMTP_USER || "").trim();
const SMTP_PASS = String(process.env.SMTP_PASS || "").trim();
const SMTP_FROM = String(process.env.SMTP_FROM || "").trim();

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "db.json");

function createEmptyDb() {
  return {
    users: [],
    password_reset_tokens: [],
    counters: {
      user: 0,
      comment: 0
    }
  };
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(text, maxLength) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function normalizeMultiline(text, maxLength) {
  return String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeUsername(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}_.-]/gu, "")
    .slice(0, 24);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function sanitizeAvatarDataUrl(input) {
  const value = String(input || "").trim();
  if (!value) {
    return "";
  }

  const isDataImage = /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(value);
  if (!isDataImage) {
    return "";
  }

  if (value.length > 1_500_000) {
    return "";
  }

  return value;
}

function normalizeComment(comment) {
  return {
    id: Number(comment?.id) || 0,
    text: normalizeText(comment?.text, 240),
    author_name: normalizeText(comment?.author_name, 60) || "User",
    created_at: String(comment?.created_at || nowIso())
  };
}

function normalizeUser(user) {
  const normalizedUsername = normalizeUsername(user?.username || user?.nickname || "user");
  const nickname = normalizeText(user?.nickname || user?.username || "User", 40) || "User";

  return {
    id: Number(user?.id) || 0,
    email: String(user?.email || "").trim().toLowerCase(),
    username: normalizedUsername,
    nickname,
    full_name: normalizeText(user?.full_name, 80),
    bio: normalizeMultiline(user?.bio, 300),
    avatar_data_url: sanitizeAvatarDataUrl(user?.avatar_data_url),
    password_hash: String(user?.password_hash || ""),
    role: user?.role === "admin" ? "admin" : "user",
    comments: Array.isArray(user?.comments) ? user.comments.map(normalizeComment).filter((item) => item.id > 0 && item.text) : [],
    created_at: String(user?.created_at || nowIso())
  };
}

function createPasswordTokenRecord(record) {
  return {
    id: Number(record?.id) || 0,
    user_id: Number(record?.user_id) || 0,
    token_hash: String(record?.token_hash || ""),
    created_at: String(record?.created_at || nowIso()),
    expires_at: String(record?.expires_at || nowIso()),
    used_at: record?.used_at ? String(record.used_at) : null
  };
}

function loadDb() {
  if (!fs.existsSync(dbPath)) {
    const empty = createEmptyDb();
    fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const normalized = createEmptyDb();

    normalized.users = Array.isArray(parsed.users) ? parsed.users.map(normalizeUser) : [];
    normalized.password_reset_tokens = Array.isArray(parsed.password_reset_tokens)
      ? parsed.password_reset_tokens.map(createPasswordTokenRecord).filter((item) => item.id > 0 && item.user_id > 0 && item.token_hash)
      : [];

    normalized.counters.user = Number(parsed.counters?.user || 0);
    normalized.counters.comment = Number(parsed.counters?.comment || 0);

    if (normalized.counters.user === 0 && normalized.users.length > 0) {
      normalized.counters.user = Math.max(...normalized.users.map((item) => Number(item.id) || 0));
    }

    if (normalized.counters.comment === 0) {
      const allCommentIds = normalized.users.flatMap((item) => item.comments.map((comment) => comment.id));
      normalized.counters.comment = allCommentIds.length ? Math.max(...allCommentIds) : 0;
    }

    return normalized;
  } catch (error) {
    console.error("Cannot parse db.json, creating a new one.", error);
    const empty = createEmptyDb();
    fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
}

const db = loadDb();

function persistDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function nextUserId() {
  db.counters.user = Number(db.counters.user || 0) + 1;
  return db.counters.user;
}

function nextCommentId() {
  db.counters.comment = Number(db.counters.comment || 0) + 1;
  return db.counters.comment;
}

function nextResetTokenId() {
  const maxId = db.password_reset_tokens.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 0);
  return maxId + 1;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function cleanupResetTokens() {
  const nowMs = Date.now();
  db.password_reset_tokens = db.password_reset_tokens.filter((item) => {
    const expiresAt = new Date(item.expires_at).getTime();
    const usedAt = item.used_at ? new Date(item.used_at).getTime() : 0;
    if (!Number.isFinite(expiresAt)) {
      return false;
    }
    if (item.used_at) {
      return nowMs - usedAt < 1000 * 60 * 60 * 24;
    }
    return expiresAt > nowMs;
  });
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    fullName: user.full_name,
    bio: user.bio,
    avatarDataUrl: user.avatar_data_url,
    role: user.role,
    createdAt: user.created_at
  };
}

function findUserById(id) {
  return db.users.find((user) => user.id === Number(id)) || null;
}

function findUserByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return db.users.find((user) => user.email === normalizedEmail) || null;
}

function findUserByUsername(username) {
  const normalizedUsername = normalizeUsername(username);
  return db.users.find((user) => user.username === normalizedUsername) || null;
}

function ensureAdminForEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!ADMIN_EMAIL || normalizedEmail !== ADMIN_EMAIL) {
    return;
  }

  const user = findUserByEmail(normalizedEmail);
  if (user && user.role !== "admin") {
    user.role = "admin";
    persistDb();
  }
}

function createUser({ email, username, passwordHash }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedUsername = normalizeUsername(username);
  const nickname = normalizeText(username, 40) || "User";
  const role = ADMIN_EMAIL && normalizedEmail === ADMIN_EMAIL ? "admin" : "user";

  const user = {
    id: nextUserId(),
    email: normalizedEmail,
    username: normalizedUsername,
    nickname,
    full_name: "",
    bio: "",
    avatar_data_url: "",
    password_hash: passwordHash || "",
    role,
    comments: [],
    created_at: nowIso()
  };

  db.users.push(user);
  persistDb();
  return user;
}

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Требуется авторизация." });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Недостаточно прав." });
  }
  return next();
}

function buildCollections() {
  return [
    {
      id: "cinematic",
      title: "Cinematic Collection",
      subtitle: "Тёплые закаты и объёмный свет",
      stage: "v0.1"
    },
    {
      id: "survival",
      title: "Survival Focus",
      subtitle: "Чистая читаемость в ночных сценах",
      stage: "beta"
    },
    {
      id: "lite",
      title: "Lite Motion",
      subtitle: "Стабильный FPS на Java",
      stage: "stable"
    }
  ];
}

function buildResetLink(req, token) {
  const baseUrl = APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/auth?reset=${encodeURIComponent(token)}`;
}

function createTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_FROM) {
    return null;
  }

  const auth = SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth
  });
}

const mailTransporter = createTransporter();

async function sendPasswordResetEmail(req, email, token) {
  const resetLink = buildResetLink(req, token);

  if (!mailTransporter) {
    console.log(`[password-reset] ${email}: ${resetLink}`);
    return { sent: false, resetLink };
  }

  const html = `
    <div style="font-family:Arial,sans-serif;background:#101010;color:#ffffff;padding:24px;">
      <h2 style="margin:0 0 12px;color:#FFA9DE;">KimpintyaoVisual</h2>
      <p>Запрошена смена пароля для аккаунта ${email}.</p>
      <p>Нажми кнопку ниже, чтобы установить новый пароль:</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#FFA9DE;color:#0a0a0a;text-decoration:none;font-weight:700;">
          Сменить пароль
        </a>
      </p>
      <p style="color:#c9c9c9;font-size:14px;">Ссылка активна 30 минут.</p>
    </div>
  `;

  await mailTransporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "KimpintyaoVisual - Смена пароля",
    text: `Ссылка для смены пароля: ${resetLink}`,
    html
  });

  return { sent: true, resetLink };
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  try {
    done(null, toPublicUser(findUserById(Number(id))));
  } catch (error) {
    done(error);
  }
});

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/config", (req, res) => {
  res.json({
    version: "0.2 (Profile + Admin)",
    platform: "Java Edition"
  });
});

app.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.json({ authenticated: false, user: null });
  }

  const fresh = findUserById(req.user.id);
  return res.json({ authenticated: true, user: toPublicUser(fresh) });
});

app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const username = normalizeUsername(req.body?.username);
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (username.length < 2) {
      return res.status(400).json({ error: "Username должен быть минимум 2 символа." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Некорректный email." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Пароль должен быть минимум 6 символов." });
    }
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: "Пользователь с таким email уже существует." });
    }
    if (findUserByUsername(username)) {
      return res.status(409).json({ error: "Username уже занят." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = createUser({
      email,
      username,
      passwordHash
    });

    req.login(toPublicUser(user), (err) => {
      if (err) {
        return res.status(500).json({ error: "Ошибка сессии после регистрации." });
      }
      return res.status(201).json({ ok: true, user: toPublicUser(user) });
    });

    return undefined;
  } catch (error) {
    return res.status(500).json({ error: "Не удалось зарегистрировать аккаунт." });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Укажи email и пароль." });
    }

    const user = findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    ensureAdminForEmail(email);
    const freshUser = findUserById(user.id);

    req.login(toPublicUser(freshUser), (err) => {
      if (err) {
        return res.status(500).json({ error: "Ошибка сессии при входе." });
      }
      return res.json({ ok: true, user: toPublicUser(freshUser) });
    });

    return undefined;
  } catch (error) {
    return res.status(500).json({ error: "Не удалось войти." });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return res.status(500).json({ error: "Не удалось выйти из аккаунта." });
    }

    return req.session.destroy(() => {
      res.json({ ok: true });
    });
  });
});

app.post("/api/auth/password/request", authLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Некорректный email." });
    }

    const user = findUserByEmail(email);
    cleanupResetTokens();

    let debugResetLink = null;

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenRecord = {
        id: nextResetTokenId(),
        user_id: user.id,
        token_hash: hashToken(token),
        created_at: nowIso(),
        expires_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        used_at: null
      };

      db.password_reset_tokens.push(tokenRecord);
      const emailResult = await sendPasswordResetEmail(req, user.email, token);
      if (!emailResult.sent && process.env.NODE_ENV !== "production") {
        debugResetLink = emailResult.resetLink;
      }
      persistDb();
    }

    return res.json({
      ok: true,
      message: "Если email существует, ссылка для смены пароля отправлена.",
      ...(debugResetLink ? { debugResetLink } : {})
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось обработать запрос на смену пароля." });
  }
});

app.post("/api/auth/password/reset", authLimiter, async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");

    if (token.length < 16) {
      return res.status(400).json({ error: "Некорректный токен сброса." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Новый пароль должен быть минимум 6 символов." });
    }

    cleanupResetTokens();
    const tokenHash = hashToken(token);
    const record = db.password_reset_tokens.find((item) => item.token_hash === tokenHash && !item.used_at);

    if (!record) {
      return res.status(400).json({ error: "Ссылка недействительна или уже использована." });
    }

    const expiresAtMs = new Date(record.expires_at).getTime();
    if (!Number.isFinite(expiresAtMs) || expiresAtMs < Date.now()) {
      return res.status(400).json({ error: "Срок действия ссылки истек." });
    }

    const user = findUserById(record.user_id);
    if (!user) {
      return res.status(400).json({ error: "Пользователь не найден." });
    }

    user.password_hash = await bcrypt.hash(newPassword, 12);
    record.used_at = nowIso();
    persistDb();

    return res.json({ ok: true, message: "Пароль успешно обновлён." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось обновить пароль." });
  }
});

app.get("/api/profile", requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "Профиль не найден." });
  }

  return res.json({
    ok: true,
    user: toPublicUser(user),
    comments: user.comments,
    collections: buildCollections()
  });
});

app.put("/api/profile", requireAuth, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    const requestedUsername = normalizeUsername(req.body?.username || user.username);
    const requestedNickname = normalizeText(req.body?.nickname || user.nickname, 40);
    const requestedFullName = normalizeText(req.body?.fullName || user.full_name, 80);
    const requestedBio = normalizeMultiline(req.body?.bio || user.bio, 300);

    let requestedAvatar = user.avatar_data_url;
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "avatarDataUrl")) {
      requestedAvatar = sanitizeAvatarDataUrl(req.body.avatarDataUrl);
    }

    if (requestedUsername.length < 2) {
      return res.status(400).json({ error: "Username должен быть минимум 2 символа." });
    }
    if (requestedNickname.length < 2) {
      return res.status(400).json({ error: "Ник должен быть минимум 2 символа." });
    }

    const sameUsername = db.users.find((item) => item.username === requestedUsername && item.id !== user.id);
    if (sameUsername) {
      return res.status(409).json({ error: "Этот username уже занят." });
    }

    user.username = requestedUsername;
    user.nickname = requestedNickname;
    user.full_name = requestedFullName;
    user.bio = requestedBio;
    user.avatar_data_url = requestedAvatar;
    persistDb();

    req.login(toPublicUser(user), (err) => {
      if (err) {
        return res.status(500).json({ error: "Ошибка сессии после обновления профиля." });
      }

      return res.json({ ok: true, user: toPublicUser(user) });
    });

    return undefined;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось сохранить профиль." });
  }
});

app.post("/api/profile/comments", requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }

  const text = normalizeText(req.body?.text, 240);
  if (!text) {
    return res.status(400).json({ error: "Комментарий не может быть пустым." });
  }

  const comment = {
    id: nextCommentId(),
    text,
    author_name: user.nickname || user.username,
    created_at: nowIso()
  };

  user.comments.unshift(comment);
  user.comments = user.comments.slice(0, 120);
  persistDb();

  return res.status(201).json({ ok: true, comment, comments: user.comments });
});

app.get("/api/admin/overview", requireAuth, requireAdmin, (req, res) => {
  const totalUsers = db.users.length;
  const adminUsers = db.users.filter((item) => item.role === "admin").length;
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const newUsers7d = db.users.filter((item) => new Date(item.created_at).getTime() >= weekAgo).length;
  const commentsTotal = db.users.reduce((acc, item) => acc + item.comments.length, 0);

  return res.json({
    ok: true,
    stats: {
      totalUsers,
      adminUsers,
      newUsers7d,
      commentsTotal
    }
  });
});

app.get("/api/admin/users", requireAuth, requireAdmin, (req, res) => {
  const users = db.users.map((item) => ({
    id: item.id,
    email: item.email,
    username: item.username,
    nickname: item.nickname,
    fullName: item.full_name,
    role: item.role,
    commentsCount: item.comments.length,
    createdAt: item.created_at
  }));

  return res.json({ ok: true, users });
});

app.patch("/api/admin/users/:id/role", requireAuth, requireAdmin, (req, res) => {
  const targetId = Number(req.params.id);
  const role = req.body?.role === "admin" ? "admin" : "user";

  const target = findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }

  if (target.id === req.user.id && role !== "admin") {
    return res.status(400).json({ error: "Нельзя снять права admin у самого себя." });
  }

  target.role = role;
  persistDb();

  return res.json({
    ok: true,
    user: {
      id: target.id,
      role: target.role
    }
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth", "index.html"));
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  return res.sendFile(path.join(__dirname, "public", "profile", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((error, req, res, next) => {
  if (error) {
    console.error(error);
  }
  res.status(500).json({ error: "Внутренняя ошибка сервера." });
});

app.listen(PORT, () => {
  console.log(`KimpintyaoVisual server is running on http://localhost:${PORT}`);
});
