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
const BUILTIN_OWNER_EMAIL = "stepaneartem47@gmail.com";
const BUILTIN_ADMIN_EMAILS = [BUILTIN_OWNER_EMAIL];
const ADMIN_EMAIL_SET = new Set(
  [ADMIN_EMAIL, ...BUILTIN_ADMIN_EMAILS]
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean)
);
const DEFAULT_ROLE = "user";
const OWNER_ROLE = "owner";
const ROLE_NAME_RE = /^[a-z0-9_-]{2,32}$/;
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const DEFAULT_THEME_PRESET = "violet";
const ALLOWED_THEME_PRESETS = new Set(["violet", "ocean", "emerald", "sunset"]);
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
    roles: createDefaultRoles(),
    activity_logs: [],
    news_posts: [],
    user_messages: [],
    password_reset_tokens: [],
    counters: {
      user: 0,
      comment: 0,
      activity: 0,
      news: 0,
      message: 0
    }
  };
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeRoleName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

function normalizePermissions(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return Array.from(
    new Set(
      items
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, 50)
    )
  );
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (["1", "true", "yes", "on"].includes(raw)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(raw)) {
    return false;
  }
  return fallback;
}

function normalizeThemePreset(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return ALLOWED_THEME_PRESETS.has(normalized) ? normalized : DEFAULT_THEME_PRESET;
}

function normalizeHexColor(value) {
  const normalized = String(value || "").trim();
  if (!HEX_COLOR_RE.test(normalized)) {
    return "";
  }
  if (normalized.length === 4) {
    const r = normalized[1];
    const g = normalized[2];
    const b = normalized[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return normalized.toLowerCase();
}

function getDefaultRoleColors(roleName) {
  const normalized = normalizeRoleName(roleName || DEFAULT_ROLE);
  if (normalized === OWNER_ROLE) {
    return { primary: "#ffbe5a", secondary: "#ff8d3e" };
  }
  if (normalized === "admin") {
    return { primary: "#6aa9ff", secondary: "#3f7df2" };
  }
  if (normalized === "moderator") {
    return { primary: "#7bdfa0", secondary: "#48a66d" };
  }
  return { primary: "#a0a0c4", secondary: "#6f719c" };
}

function normalizeRoleColors(primary, secondary, roleName) {
  const defaults = getDefaultRoleColors(roleName);
  const normalizedPrimary = normalizeHexColor(primary) || defaults.primary;
  const normalizedSecondary = normalizeHexColor(secondary) || defaults.secondary;
  return {
    primary: normalizedPrimary,
    secondary: normalizedSecondary
  };
}

function normalizeTargetRoles(input) {
  const rawItems = Array.isArray(input)
    ? input
    : String(input || "")
      .split(",")
      .map((item) => item.trim());

  const normalized = Array.from(
    new Set(
      rawItems
        .map((item) => normalizeRoleName(item))
        .filter((item) => item && (item === "all" || ROLE_NAME_RE.test(item)))
    )
  );

  if (!normalized.length || normalized.includes("all")) {
    return ["all"];
  }
  return normalized;
}

function createDefaultRoles() {
  return [
    {
      name: OWNER_ROLE,
      label: "Owner",
      permissions: ["*"],
      color_primary: "#ffbe5a",
      color_secondary: "#ff8d3e",
      system: true,
      created_at: nowIso()
    },
    {
      name: "admin",
      label: "Admin",
      permissions: ["admin.panel", "users.manage", "roles.manage", "activity.view", "ban.manage"],
      color_primary: "#6aa9ff",
      color_secondary: "#3f7df2",
      system: true,
      created_at: nowIso()
    },
    {
      name: "moderator",
      label: "Moderator",
      permissions: ["users.manage", "activity.view", "ban.manage"],
      color_primary: "#7bdfa0",
      color_secondary: "#48a66d",
      system: true,
      created_at: nowIso()
    },
    {
      name: DEFAULT_ROLE,
      label: "User",
      permissions: [],
      color_primary: "#a0a0c4",
      color_secondary: "#6f719c",
      system: true,
      created_at: nowIso()
    }
  ];
}

function normalizeRole(role) {
  const normalizedName = normalizeRoleName(role?.name);
  const safeName = ROLE_NAME_RE.test(normalizedName) ? normalizedName : DEFAULT_ROLE;
  const fallbackLabel = safeName.charAt(0).toUpperCase() + safeName.slice(1);
  const colors = normalizeRoleColors(role?.color_primary, role?.color_secondary, safeName);

  return {
    name: safeName,
    label: normalizeText(role?.label || fallbackLabel, 40) || fallbackLabel,
    permissions: normalizePermissions(role?.permissions),
    color_primary: colors.primary,
    color_secondary: colors.secondary,
    system: Boolean(role?.system),
    created_at: String(role?.created_at || nowIso())
  };
}

function normalizeActivityLog(log) {
  return {
    id: Number(log?.id) || 0,
    event: normalizeText(log?.event, 80) || "event.unknown",
    user_id: Number(log?.user_id) || 0,
    user_email: String(log?.user_email || "").trim().toLowerCase(),
    target_user_id: Number(log?.target_user_id) || 0,
    ip: normalizeText(log?.ip, 64),
    path: normalizeText(log?.path, 140),
    method: normalizeText(log?.method, 10).toUpperCase(),
    meta: log?.meta && typeof log.meta === "object" && !Array.isArray(log.meta) ? log.meta : {},
    created_at: String(log?.created_at || nowIso())
  };
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
  const normalizedRole = normalizeRoleName(user?.role || DEFAULT_ROLE);
  const role = ROLE_NAME_RE.test(normalizedRole) ? normalizedRole : DEFAULT_ROLE;

  return {
    id: Number(user?.id) || 0,
    email: String(user?.email || "").trim().toLowerCase(),
    username: normalizedUsername,
    nickname,
    full_name: normalizeText(user?.full_name, 80),
    bio: normalizeMultiline(user?.bio, 300),
    avatar_data_url: sanitizeAvatarDataUrl(user?.avatar_data_url),
    show_email: normalizeBoolean(user?.show_email, false),
    profile_private: normalizeBoolean(user?.profile_private, false),
    theme_preset: normalizeThemePreset(user?.theme_preset),
    password_hash: String(user?.password_hash || ""),
    role,
    banned_until: user?.banned_until ? String(user.banned_until) : null,
    ban_reason: normalizeText(user?.ban_reason, 180),
    banned_by: Number(user?.banned_by) || 0,
    last_login_at: user?.last_login_at ? String(user.last_login_at) : null,
    last_active_at: user?.last_active_at ? String(user.last_active_at) : null,
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

function normalizeNewsPost(post) {
  return {
    id: Number(post?.id) || 0,
    title: normalizeText(post?.title, 120),
    text: normalizeMultiline(post?.text, 3500),
    author_id: Number(post?.author_id) || 0,
    author_username: normalizeText(post?.author_username, 60) || "system",
    author_role: normalizeRoleName(post?.author_role || DEFAULT_ROLE) || DEFAULT_ROLE,
    target_roles: normalizeTargetRoles(post?.target_roles),
    email_delivery: {
      sent: Number(post?.email_delivery?.sent) || 0,
      failed: Number(post?.email_delivery?.failed) || 0,
      skipped: Number(post?.email_delivery?.skipped) || 0
    },
    created_at: String(post?.created_at || nowIso()),
    updated_at: post?.updated_at ? String(post.updated_at) : null
  };
}

function normalizeUserMessage(message) {
  return {
    id: Number(message?.id) || 0,
    user_id: Number(message?.user_id) || 0,
    type: normalizeText(message?.type, 40) || "news",
    title: normalizeText(message?.title, 140),
    text: normalizeMultiline(message?.text, 3500),
    source_news_id: Number(message?.source_news_id) || 0,
    created_at: String(message?.created_at || nowIso()),
    read_at: message?.read_at ? String(message.read_at) : null
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
    normalized.roles = Array.isArray(parsed.roles)
      ? parsed.roles.map(normalizeRole).filter((role, index, arr) => role.name && arr.findIndex((item) => item.name === role.name) === index)
      : createDefaultRoles();
    normalized.activity_logs = Array.isArray(parsed.activity_logs)
      ? parsed.activity_logs.map(normalizeActivityLog).filter((log) => log.id > 0 && log.event)
      : [];
    normalized.news_posts = Array.isArray(parsed.news_posts)
      ? parsed.news_posts.map(normalizeNewsPost).filter((item) => item.id > 0 && item.title && item.text)
      : [];
    normalized.user_messages = Array.isArray(parsed.user_messages)
      ? parsed.user_messages.map(normalizeUserMessage).filter((item) => item.id > 0 && item.user_id > 0 && item.title)
      : [];
    normalized.password_reset_tokens = Array.isArray(parsed.password_reset_tokens)
      ? parsed.password_reset_tokens.map(createPasswordTokenRecord).filter((item) => item.id > 0 && item.user_id > 0 && item.token_hash)
      : [];

    normalized.counters.user = Number(parsed.counters?.user || 0);
    normalized.counters.comment = Number(parsed.counters?.comment || 0);
    normalized.counters.activity = Number(parsed.counters?.activity || 0);
    normalized.counters.news = Number(parsed.counters?.news || 0);
    normalized.counters.message = Number(parsed.counters?.message || 0);

    if (normalized.counters.user === 0 && normalized.users.length > 0) {
      normalized.counters.user = Math.max(...normalized.users.map((item) => Number(item.id) || 0));
    }

    if (normalized.counters.comment === 0) {
      const allCommentIds = normalized.users.flatMap((item) => item.comments.map((comment) => comment.id));
      normalized.counters.comment = allCommentIds.length ? Math.max(...allCommentIds) : 0;
    }

    if (normalized.counters.activity === 0 && normalized.activity_logs.length > 0) {
      normalized.counters.activity = Math.max(...normalized.activity_logs.map((item) => Number(item.id) || 0));
    }

    if (normalized.counters.news === 0 && normalized.news_posts.length > 0) {
      normalized.counters.news = Math.max(...normalized.news_posts.map((item) => Number(item.id) || 0));
    }

    if (normalized.counters.message === 0 && normalized.user_messages.length > 0) {
      normalized.counters.message = Math.max(...normalized.user_messages.map((item) => Number(item.id) || 0));
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

function isOwnerEmail(email) {
  return String(email || "").trim().toLowerCase() === BUILTIN_OWNER_EMAIL;
}

function findRoleByName(name) {
  const normalizedName = normalizeRoleName(name);
  return db.roles.find((role) => role.name === normalizedName) || null;
}

function ensureCoreRoles() {
  const defaults = createDefaultRoles();
  const existing = new Set(db.roles.map((item) => item.name));
  defaults.forEach((role) => {
    if (!existing.has(role.name)) {
      db.roles.push(role);
      existing.add(role.name);
    }
  });

  if (!findRoleByName(DEFAULT_ROLE)) {
    db.roles.push(normalizeRole({ name: DEFAULT_ROLE, label: "User", permissions: [], system: true }));
  }
}

function enforcePinnedAdmins() {
  let changed = false;
  ensureCoreRoles();

  db.users.forEach((user) => {
    if (isOwnerEmail(user.email) && user.role !== OWNER_ROLE) {
      user.role = OWNER_ROLE;
      changed = true;
      return;
    }

    if (isAdminEmail(user.email) && user.role !== "admin" && user.role !== OWNER_ROLE) {
      user.role = "admin";
      changed = true;
      return;
    }

    if (!findRoleByName(user.role)) {
      user.role = DEFAULT_ROLE;
      changed = true;
    }
  });

  if (changed) {
    persistDb();
  }
}

enforcePinnedAdmins();

function nextUserId() {
  db.counters.user = Number(db.counters.user || 0) + 1;
  return db.counters.user;
}

function nextCommentId() {
  db.counters.comment = Number(db.counters.comment || 0) + 1;
  return db.counters.comment;
}

function nextActivityId() {
  db.counters.activity = Number(db.counters.activity || 0) + 1;
  return db.counters.activity;
}

function nextNewsId() {
  db.counters.news = Number(db.counters.news || 0) + 1;
  return db.counters.news;
}

function nextMessageId() {
  db.counters.message = Number(db.counters.message || 0) + 1;
  return db.counters.message;
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

function getRolePermissions(roleName) {
  const role = findRoleByName(roleName);
  return role ? role.permissions : [];
}

function getRoleLabel(roleName) {
  const role = findRoleByName(roleName);
  if (role?.label) {
    return role.label;
  }

  if (roleName === OWNER_ROLE) {
    return "Owner";
  }
  if (roleName === "admin") {
    return "Admin";
  }
  if (roleName === "moderator") {
    return "Moderator";
  }
  return "User";
}

function getRoleStyle(roleName) {
  const role = findRoleByName(roleName);
  const defaults = getDefaultRoleColors(roleName);
  return {
    primary: normalizeHexColor(role?.color_primary) || defaults.primary,
    secondary: normalizeHexColor(role?.color_secondary) || defaults.secondary
  };
}

function countDaysOnSite(createdAtIso) {
  const createdAtMs = new Date(createdAtIso).getTime();
  if (!Number.isFinite(createdAtMs)) {
    return 0;
  }
  return Math.max(1, Math.floor((Date.now() - createdAtMs) / (1000 * 60 * 60 * 24)) + 1);
}

function buildUserActivityCountMap() {
  const map = new Map();
  db.activity_logs.forEach((log) => {
    const userId = Number(log.user_id) || 0;
    if (userId <= 0) {
      return;
    }
    map.set(userId, (map.get(userId) || 0) + 1);
  });
  return map;
}

function isUserBanned(user) {
  const bannedUntilMs = user?.banned_until ? new Date(user.banned_until).getTime() : 0;
  return Number.isFinite(bannedUntilMs) && bannedUntilMs > Date.now();
}

function clearExpiredBan(user) {
  if (!user || !user.banned_until) {
    return false;
  }

  const bannedUntilMs = new Date(user.banned_until).getTime();
  if (!Number.isFinite(bannedUntilMs) || bannedUntilMs > Date.now()) {
    return false;
  }

  user.banned_until = null;
  user.ban_reason = "";
  user.banned_by = 0;
  return true;
}

function resolveUserRole(user) {
  if (!user) {
    return DEFAULT_ROLE;
  }
  if (isOwnerEmail(user.email)) {
    return OWNER_ROLE;
  }
  const normalizedRole = normalizeRoleName(user.role || DEFAULT_ROLE);
  if (findRoleByName(normalizedRole)) {
    return normalizedRole;
  }
  return DEFAULT_ROLE;
}

function userHasPermission(user, permission) {
  if (!user) {
    return false;
  }

  if (isOwnerEmail(user.email)) {
    return true;
  }

  const permissions = getRolePermissions(resolveUserRole(user));
  return permissions.includes("*") || permissions.includes(permission);
}

function touchUserActivity(user) {
  if (!user) {
    return;
  }

  const previous = user.last_active_at ? new Date(user.last_active_at).getTime() : 0;
  const nowMs = Date.now();
  if (!Number.isFinite(previous) || nowMs - previous > 1000 * 30) {
    user.last_active_at = new Date(nowMs).toISOString();
    persistDb();
  }
}

function addActivityLog(event, req, actorUser, meta = {}, targetUserId = 0) {
  const actor = actorUser || null;
  db.activity_logs.push(
    normalizeActivityLog({
      id: nextActivityId(),
      event,
      user_id: Number(actor?.id) || 0,
      user_email: String(actor?.email || "").trim().toLowerCase(),
      target_user_id: Number(targetUserId) || 0,
      ip: String(req?.ip || req?.headers?.["x-forwarded-for"] || "").slice(0, 64),
      path: String(req?.originalUrl || req?.url || "").slice(0, 140),
      method: String(req?.method || "").toUpperCase(),
      meta,
      created_at: nowIso()
    })
  );

  if (db.activity_logs.length > 5000) {
    db.activity_logs = db.activity_logs.slice(-5000);
  }

  persistDb();
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const resolvedRole = resolveUserRole(user);

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    fullName: user.full_name,
    bio: user.bio,
    avatarDataUrl: user.avatar_data_url,
    showEmail: Boolean(user.show_email),
    profilePrivate: Boolean(user.profile_private),
    themePreset: normalizeThemePreset(user.theme_preset),
    role: resolvedRole,
    roleLabel: getRoleLabel(resolvedRole),
    rolePermissions: getRolePermissions(resolvedRole),
    roleStyle: getRoleStyle(resolvedRole),
    bannedUntil: user.banned_until,
    banReason: user.ban_reason,
    lastLoginAt: user.last_login_at,
    lastActiveAt: user.last_active_at,
    createdAt: user.created_at
  };
}

function toPublicDirectoryUser(user, activityCount = 0) {
  const resolvedRole = resolveUserRole(user);
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatarDataUrl: user.avatar_data_url,
    role: resolvedRole,
    roleLabel: getRoleLabel(resolvedRole),
    roleStyle: getRoleStyle(resolvedRole),
    createdAt: user.created_at,
    lastActiveAt: user.last_active_at,
    commentsCount: Array.isArray(user.comments) ? user.comments.length : 0,
    activityCount: Number(activityCount) || 0
  };
}

function toPublicProfileUser(user, activityCount = 0) {
  const resolvedRole = resolveUserRole(user);
  const lastActiveMs = user?.last_active_at ? new Date(user.last_active_at).getTime() : 0;
  const isOnline = Number.isFinite(lastActiveMs) && Date.now() - lastActiveMs <= 1000 * 60 * 2;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    fullName: user.full_name,
    bio: user.bio,
    avatarDataUrl: user.avatar_data_url,
    showEmail: Boolean(user.show_email),
    profilePrivate: Boolean(user.profile_private),
    themePreset: normalizeThemePreset(user.theme_preset),
    role: resolvedRole,
    roleLabel: getRoleLabel(resolvedRole),
    roleStyle: getRoleStyle(resolvedRole),
    createdAt: user.created_at,
    lastActiveAt: user.last_active_at,
    isOnline,
    stats: {
      commentsTotal: Array.isArray(user.comments) ? user.comments.length : 0,
      daysOnSite: countDaysOnSite(user.created_at),
      activityTotal: Number(activityCount) || 0
    }
  };
}

function resolveMembersGroup(roleName) {
  const normalized = normalizeRoleName(roleName);
  if (normalized === OWNER_ROLE) {
    return "creators";
  }
  if (normalized === "admin") {
    return "admins";
  }
  if (normalized === "moderator") {
    return "moderators";
  }
  return "users";
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

function isAdminEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return ADMIN_EMAIL_SET.has(normalizedEmail);
}

function ensureAdminForEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!isOwnerEmail(normalizedEmail) && !isAdminEmail(normalizedEmail)) {
    return;
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    return;
  }

  if (isOwnerEmail(normalizedEmail)) {
    if (user.role !== OWNER_ROLE) {
      user.role = OWNER_ROLE;
      persistDb();
    }
    return;
  }

  if (user.role !== OWNER_ROLE && user.role !== "admin") {
    user.role = "admin";
    persistDb();
  }
}

function createUser({ email, username, passwordHash }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedUsername = normalizeUsername(username);
  const nickname = normalizeText(username, 40) || "User";
  const role = isOwnerEmail(normalizedEmail)
    ? OWNER_ROLE
    : (isAdminEmail(normalizedEmail) ? "admin" : DEFAULT_ROLE);

  const user = {
    id: nextUserId(),
    email: normalizedEmail,
    username: normalizedUsername,
    nickname,
    full_name: "",
    bio: "",
    avatar_data_url: "",
    show_email: false,
    profile_private: false,
    theme_preset: DEFAULT_THEME_PRESET,
    password_hash: passwordHash || "",
    role,
    banned_until: null,
    ban_reason: "",
    banned_by: 0,
    last_login_at: null,
    last_active_at: null,
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

  const user = findUserById(req.user?.id);
  if (!user) {
    return res.status(401).json({ error: "Сессия недействительна." });
  }

  const hadExpiredBan = clearExpiredBan(user);
  if (hadExpiredBan) {
    persistDb();
  }

  if (isUserBanned(user)) {
    return res.status(403).json({
      error: `Аккаунт временно заблокирован до ${new Date(user.banned_until).toLocaleString()}.`
    });
  }

  ensureAdminForEmail(user.email);
  touchUserActivity(user);
  req.user = toPublicUser(user);
  req.currentUser = user;
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.currentUser || !userHasPermission(req.currentUser, "admin.panel")) {
    return res.status(403).json({ error: "Недостаточно прав." });
  }
  return next();
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.currentUser || !userHasPermission(req.currentUser, permission)) {
      return res.status(403).json({ error: "Недостаточно прав." });
    }
    return next();
  };
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

function canPublishNews(user) {
  if (!user) {
    return false;
  }
  const role = resolveUserRole(user);
  return role === OWNER_ROLE || role === "admin" || isOwnerEmail(user.email);
}

function resolveNewsAudienceRoles(input) {
  const normalized = normalizeTargetRoles(input);
  if (normalized.includes("all")) {
    return ["all"];
  }

  const availableRoles = new Set(db.roles.map((role) => role.name));
  const filtered = normalized.filter((roleName) => availableRoles.has(roleName));
  return filtered.length ? filtered : ["all"];
}

function isNewsVisibleForUser(newsPost, viewer) {
  const audience = resolveNewsAudienceRoles(newsPost?.target_roles);
  if (audience.includes("all")) {
    return true;
  }
  if (!viewer) {
    return false;
  }
  const viewerRole = resolveUserRole(viewer);
  return audience.includes(viewerRole);
}

function getUsersByAudience(targetRoles) {
  const audience = resolveNewsAudienceRoles(targetRoles);
  if (audience.includes("all")) {
    return db.users.slice();
  }

  return db.users.filter((user) => audience.includes(resolveUserRole(user)));
}

function canModerateProfileComments(actor, profileOwner) {
  if (!actor || !profileOwner) {
    return false;
  }
  if (Number(actor.id) === Number(profileOwner.id)) {
    return true;
  }

  const role = resolveUserRole(actor);
  return role === OWNER_ROLE || role === "admin" || role === "moderator" || isOwnerEmail(actor.email);
}

function buildNewsLink(req, newsId) {
  const baseUrl = APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/news#news-${encodeURIComponent(newsId)}`;
}

async function sendNewsEmailToAudience(req, newsPost, users) {
  const recipients = (Array.isArray(users) ? users : [])
    .map((user) => String(user?.email || "").trim().toLowerCase())
    .filter((email, index, arr) => isValidEmail(email) && arr.indexOf(email) === index);

  if (!mailTransporter) {
    recipients.forEach((email) => {
      console.log(`[news-email] ${email}: ${newsPost.title}`);
    });
    return { sent: 0, failed: 0, skipped: recipients.length };
  }

  const newsLink = buildNewsLink(req, newsPost.id);
  const html = `
    <div style="font-family:Arial,sans-serif;background:#101010;color:#ffffff;padding:24px;">
      <h2 style="margin:0 0 12px;color:#8F76FF;">KimpintyaoVisual - Новость</h2>
      <p style="margin:0 0 10px;"><strong>${newsPost.title}</strong></p>
      <p style="white-space:pre-line;line-height:1.5;margin:0 0 16px;">${newsPost.text}</p>
      <p>
        <a href="${newsLink}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#8F76FF;color:#ffffff;text-decoration:none;font-weight:700;">
          Открыть новости
        </a>
      </p>
    </div>
  `;

  const results = await Promise.allSettled(
    recipients.map((email) => mailTransporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: `KimpintyaoVisual - ${newsPost.title}`,
      text: `${newsPost.title}\n\n${newsPost.text}\n\n${newsLink}`,
      html
    }))
  );

  const sent = results.filter((item) => item.status === "fulfilled").length;
  const failed = results.length - sent;
  return { sent, failed, skipped: 0 };
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
  // Version is intentionally pinned by request.
  res.json({
    version: "0.1",
    platform: "Java Edition"
  });
});

app.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.json({ authenticated: false, user: null });
  }

  const fresh = findUserById(req.user.id);
  if (!fresh) {
    return res.json({ authenticated: false, user: null });
  }

  ensureAdminForEmail(fresh.email);
  if (clearExpiredBan(fresh)) {
    persistDb();
  }
  if (isUserBanned(fresh)) {
    return res.status(403).json({
      authenticated: true,
      user: toPublicUser(fresh),
      error: `Аккаунт временно заблокирован до ${new Date(fresh.banned_until).toLocaleString()}.`
    });
  }

  touchUserActivity(fresh);
  return res.json({ authenticated: true, user: toPublicUser(fresh) });
});

app.get("/api/roles/public", (req, res) => {
  const roles = db.roles
    .map((role) => normalizeRole(role))
    .map((role) => ({
      name: role.name,
      label: role.label,
      color_primary: role.color_primary,
      color_secondary: role.color_secondary
    }));
  return res.json({ ok: true, roles });
});

app.get("/api/users/public", (req, res) => {
  const limitRaw = Number(req.query.limit || 24);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 120) : 24;
  const query = normalizeUsername(req.query.q || "");
  let changed = false;

  const activityMap = buildUserActivityCountMap();
  const users = db.users
    .filter((user) => {
      if (clearExpiredBan(user)) {
        changed = true;
      }
      if (query) {
        const nicknameNormalized = normalizeUsername(user.nickname || "");
        if (!user.username.includes(query) && !nicknameNormalized.includes(query)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const left = new Date(b.created_at).getTime();
      const right = new Date(a.created_at).getTime();
      if (Number.isFinite(left) && Number.isFinite(right)) {
        return left - right;
      }
      return b.id - a.id;
    })
    .slice(0, limit)
    .map((user) => toPublicDirectoryUser(user, activityMap.get(user.id) || 0));

  if (changed) {
    persistDb();
  }

  return res.json({ ok: true, users });
});

app.get("/api/users/roles", (req, res) => {
  let changed = false;
  const activityMap = buildUserActivityCountMap();
  const groups = {
    creators: [],
    admins: [],
    moderators: [],
    users: []
  };

  db.users.forEach((user) => {
    if (clearExpiredBan(user)) {
      changed = true;
    }

    const publicUser = toPublicDirectoryUser(user, activityMap.get(user.id) || 0);
    const group = resolveMembersGroup(publicUser.role);
    groups[group].push(publicUser);
  });

  const sortByRecent = (left, right) => {
    const leftMs = new Date(left.lastActiveAt || left.createdAt || 0).getTime();
    const rightMs = new Date(right.lastActiveAt || right.createdAt || 0).getTime();
    if (Number.isFinite(leftMs) && Number.isFinite(rightMs)) {
      return rightMs - leftMs;
    }
    return Number(right.id || 0) - Number(left.id || 0);
  };

  Object.keys(groups).forEach((key) => {
    groups[key].sort(sortByRecent);
  });

  if (changed) {
    persistDb();
  }

  return res.json({
    ok: true,
    updatedAt: nowIso(),
    totals: {
      creators: groups.creators.length,
      admins: groups.admins.length,
      moderators: groups.moderators.length,
      users: groups.users.length,
      all: db.users.length
    },
    groups
  });
});

app.get("/api/users/:username/profile", (req, res) => {
  const rawUsername = String(req.params.username || "").trim();
  const normalizedUsername = normalizeUsername(rawUsername);
  let targetUser = normalizedUsername ? findUserByUsername(normalizedUsername) : null;

  if (!targetUser && /^\d+$/.test(rawUsername)) {
    targetUser = findUserById(Number(rawUsername));
  }
  if (!targetUser) {
    return res.status(404).json({ error: "Профиль не найден." });
  }

  const viewer = req.isAuthenticated && req.isAuthenticated() ? findUserById(req.user?.id) : null;
  let changed = false;
  if (clearExpiredBan(targetUser)) {
    changed = true;
  }
  if (viewer && clearExpiredBan(viewer)) {
    changed = true;
  }
  if (changed) {
    persistDb();
  }

  const activityMap = buildUserActivityCountMap();
  const isSelf = Boolean(viewer && viewer.id === targetUser.id);
  const isRoleOnly = Boolean(targetUser.profile_private) && !isSelf;
  const canShowEmail = isSelf || (!isRoleOnly && Boolean(targetUser.show_email));

  const comments = isRoleOnly
    ? []
    : (Array.isArray(targetUser.comments)
      ? targetUser.comments
        .map(normalizeComment)
        .filter((comment) => comment.id > 0 && comment.text)
        .slice(0, 120)
      : []);
  const canDeleteComments = viewer ? canModerateProfileComments(viewer, targetUser) : false;

  const profileUser = toPublicProfileUser(targetUser, activityMap.get(targetUser.id) || 0);
  if (!canShowEmail) {
    profileUser.email = "";
  }
  if (isRoleOnly) {
    profileUser.nickname = "";
    profileUser.fullName = "";
    profileUser.bio = "";
    profileUser.avatarDataUrl = "";
    profileUser.createdAt = null;
    profileUser.lastActiveAt = null;
    profileUser.isOnline = false;
    profileUser.stats = {
      commentsTotal: 0,
      daysOnSite: "-",
      activityTotal: 0
    };
  }

  addActivityLog(
    "profile.view_public",
    req,
    viewer,
    {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username
    },
    targetUser.id
  );

  return res.json({
    ok: true,
    user: profileUser,
    comments,
    collections: isRoleOnly ? [] : buildCollections(),
    canDeleteComments: isRoleOnly ? false : canDeleteComments,
    isSelf,
    viewer: viewer ? toPublicUser(viewer) : null,
    profileVisibility: isRoleOnly ? "role_only" : "full",
    emailVisible: canShowEmail
  });
});

app.get("/api/news", (req, res) => {
  const limitRaw = Number(req.query.limit || 80);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 250) : 80;
  const viewer = req.isAuthenticated && req.isAuthenticated() ? findUserById(req.user?.id) : null;
  const canManageNews = canPublishNews(viewer);

  const news = db.news_posts
    .slice()
    .sort((a, b) => {
      const left = new Date(b.created_at).getTime();
      const right = new Date(a.created_at).getTime();
      if (Number.isFinite(left) && Number.isFinite(right)) {
        return left - right;
      }
      return Number(b.id || 0) - Number(a.id || 0);
    })
    .map((item) => normalizeNewsPost(item))
    .filter((item) => isNewsVisibleForUser(item, viewer))
    .slice(0, limit)
    .map((item) => ({
      ...item,
      can_manage: canManageNews
    }));

  return res.json({ ok: true, news });
});

app.post("/api/news", requireAuth, async (req, res) => {
  try {
    const actor = req.currentUser;
    if (!canPublishNews(actor)) {
      return res.status(403).json({ error: "Только создатель или администратор может публиковать новости." });
    }

    const title = normalizeText(req.body?.title, 120);
    const text = normalizeMultiline(req.body?.text, 3500);
    if (title.length < 4) {
      return res.status(400).json({ error: "Заголовок новости должен быть минимум 4 символа." });
    }
    if (text.length < 8) {
      return res.status(400).json({ error: "Текст новости должен быть минимум 8 символов." });
    }
    const targetRoles = resolveNewsAudienceRoles(req.body?.targetRoles);

    const newsPost = normalizeNewsPost({
      id: nextNewsId(),
      title,
      text,
      author_id: actor.id,
      author_username: actor.nickname || actor.username,
      author_role: resolveUserRole(actor),
      target_roles: targetRoles,
      email_delivery: { sent: 0, failed: 0, skipped: 0 },
      created_at: nowIso(),
      updated_at: null
    });

    const recipients = getUsersByAudience(targetRoles);
    const delivery = await sendNewsEmailToAudience(req, newsPost, recipients);
    newsPost.email_delivery = delivery;
    db.news_posts.unshift(newsPost);
    db.news_posts = db.news_posts.slice(0, 500);

    recipients.forEach((user) => {
      db.user_messages.push(normalizeUserMessage({
        id: nextMessageId(),
        user_id: user.id,
        type: "news",
        title: newsPost.title,
        text: newsPost.text,
        source_news_id: newsPost.id,
        created_at: newsPost.created_at,
        read_at: null
      }));
    });
    if (db.user_messages.length > 15000) {
      db.user_messages = db.user_messages.slice(-15000);
    }

    persistDb();
    addActivityLog("news.created", req, actor, {
      newsId: newsPost.id,
      title: newsPost.title,
      targetRoles: newsPost.target_roles,
      recipients: recipients.length,
      emailSent: delivery.sent,
      emailFailed: delivery.failed,
      emailSkipped: delivery.skipped
    });

    return res.status(201).json({
      ok: true,
      news: newsPost,
      delivery
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось опубликовать новость." });
  }
});

app.put("/api/news/:id", requireAuth, async (req, res) => {
  try {
    const actor = req.currentUser;
    if (!canPublishNews(actor)) {
      return res.status(403).json({ error: "Недостаточно прав для редактирования новости." });
    }

    const newsId = Number(req.params.id);
    const index = db.news_posts.findIndex((item) => Number(item.id) === newsId);
    if (index === -1) {
      return res.status(404).json({ error: "Новость не найдена." });
    }

    const current = normalizeNewsPost(db.news_posts[index]);
    const hasTitle = Object.prototype.hasOwnProperty.call(req.body || {}, "title");
    const hasText = Object.prototype.hasOwnProperty.call(req.body || {}, "text");
    const hasTargetRoles = Object.prototype.hasOwnProperty.call(req.body || {}, "targetRoles");

    const title = hasTitle ? normalizeText(req.body?.title, 120) : current.title;
    const text = hasText ? normalizeMultiline(req.body?.text, 3500) : current.text;
    const targetRoles = hasTargetRoles
      ? resolveNewsAudienceRoles(req.body?.targetRoles)
      : resolveNewsAudienceRoles(current.target_roles);

    if (title.length < 4) {
      return res.status(400).json({ error: "Заголовок новости должен быть минимум 4 символа." });
    }
    if (text.length < 8) {
      return res.status(400).json({ error: "Текст новости должен быть минимум 8 символов." });
    }

    const resendEmail = normalizeBoolean(req.body?.resendEmail, false);
    const recipients = getUsersByAudience(targetRoles);
    const updatedAt = nowIso();

    const updatedNews = normalizeNewsPost({
      ...current,
      title,
      text,
      target_roles: targetRoles,
      updated_at: updatedAt
    });

    if (resendEmail) {
      updatedNews.email_delivery = await sendNewsEmailToAudience(req, updatedNews, recipients);
    }

    db.news_posts[index] = updatedNews;
    db.user_messages = db.user_messages.filter((item) => Number(item.source_news_id) !== Number(updatedNews.id));
    recipients.forEach((user) => {
      db.user_messages.push(normalizeUserMessage({
        id: nextMessageId(),
        user_id: user.id,
        type: "news",
        title: updatedNews.title,
        text: updatedNews.text,
        source_news_id: updatedNews.id,
        created_at: updatedAt,
        read_at: null
      }));
    });
    if (db.user_messages.length > 15000) {
      db.user_messages = db.user_messages.slice(-15000);
    }

    persistDb();
    addActivityLog("news.updated", req, actor, {
      newsId: updatedNews.id,
      targetRoles: updatedNews.target_roles,
      recipients: recipients.length,
      resendEmail
    });

    return res.json({
      ok: true,
      news: updatedNews,
      delivery: updatedNews.email_delivery
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось обновить новость." });
  }
});

app.delete("/api/news/:id", requireAuth, (req, res) => {
  const actor = req.currentUser;
  if (!canPublishNews(actor)) {
    return res.status(403).json({ error: "Недостаточно прав для удаления новости." });
  }

  const newsId = Number(req.params.id);
  const current = db.news_posts.find((item) => Number(item.id) === newsId);
  if (!current) {
    return res.status(404).json({ error: "Новость не найдена." });
  }

  db.news_posts = db.news_posts.filter((item) => Number(item.id) !== newsId);
  db.user_messages = db.user_messages.filter((item) => Number(item.source_news_id) !== newsId);
  persistDb();

  addActivityLog("news.deleted", req, actor, {
    newsId,
    title: normalizeText(current.title, 120)
  });

  return res.json({ ok: true });
});

app.get("/api/messages", requireAuth, (req, res) => {
  const actor = req.currentUser;
  const limitRaw = Number(req.query.limit || 120);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 300) : 120;
  const messages = db.user_messages
    .filter((item) => Number(item.user_id) === Number(actor.id))
    .sort((a, b) => {
      const left = new Date(b.created_at).getTime();
      const right = new Date(a.created_at).getTime();
      if (Number.isFinite(left) && Number.isFinite(right)) {
        return left - right;
      }
      return Number(b.id || 0) - Number(a.id || 0);
    })
    .slice(0, limit)
    .map((item) => normalizeUserMessage(item));

  const unread = messages.filter((item) => !item.read_at).length;
  return res.json({ ok: true, messages, unread });
});

app.post("/api/messages/:id/read", requireAuth, (req, res) => {
  const actor = req.currentUser;
  const messageId = Number(req.params.id);
  const message = db.user_messages.find((item) => Number(item.id) === messageId && Number(item.user_id) === Number(actor.id));
  if (!message) {
    return res.status(404).json({ error: "Сообщение не найдено." });
  }

  if (!message.read_at) {
    message.read_at = nowIso();
    persistDb();
  }

  return res.json({ ok: true, message: normalizeUserMessage(message) });
});

app.post("/api/messages/read-all", requireAuth, (req, res) => {
  const actor = req.currentUser;
  let changed = false;
  const now = nowIso();

  db.user_messages.forEach((item) => {
    if (Number(item.user_id) === Number(actor.id) && !item.read_at) {
      item.read_at = now;
      changed = true;
    }
  });

  if (changed) {
    persistDb();
  }

  return res.json({ ok: true });
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
    user.last_login_at = nowIso();
    user.last_active_at = user.last_login_at;
    persistDb();
    addActivityLog("auth.register", req, user, { username: user.username });

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
      addActivityLog("auth.login_failed", req, null, { email });
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      addActivityLog("auth.login_failed", req, user, { email });
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    ensureAdminForEmail(email);
    const freshUser = findUserById(user.id);
    if (!freshUser) {
      return res.status(500).json({ error: "Пользователь не найден после входа." });
    }

    if (clearExpiredBan(freshUser)) {
      persistDb();
    }
    if (isUserBanned(freshUser)) {
      addActivityLog("auth.login_blocked_ban", req, freshUser, { bannedUntil: freshUser.banned_until });
      return res.status(403).json({
        error: `Аккаунт временно заблокирован до ${new Date(freshUser.banned_until).toLocaleString()}.`
      });
    }

    freshUser.last_login_at = nowIso();
    freshUser.last_active_at = freshUser.last_login_at;
    persistDb();
    addActivityLog("auth.login", req, freshUser, { email: freshUser.email });

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
  const actor = req.user ? findUserById(req.user.id) : null;
  if (actor) {
    addActivityLog("auth.logout", req, actor);
  }
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
      addActivityLog("auth.password_reset_requested", req, user);
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
    addActivityLog("auth.password_reset_completed", req, user);

    return res.json({ ok: true, message: "Пароль успешно обновлён." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не удалось обновить пароль." });
  }
});

app.get("/api/profile", requireAuth, (req, res) => {
  const user = req.currentUser;
  if (!user) {
    return res.status(404).json({ error: "Профиль не найден." });
  }
  const activityMap = buildUserActivityCountMap();

  addActivityLog("profile.view", req, user);

  return res.json({
    ok: true,
    user: toPublicProfileUser(user, activityMap.get(user.id) || 0),
    comments: user.comments,
    collections: buildCollections(),
    canDeleteComments: true,
    profileVisibility: "full",
    emailVisible: true
  });
});

app.put("/api/profile", requireAuth, (req, res) => {
  try {
    const user = req.currentUser;
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    const requestedUsername = normalizeUsername(req.body?.username || user.username);
    const requestedNickname = normalizeText(req.body?.nickname || user.nickname, 40);
    const requestedFullName = normalizeText(req.body?.fullName || user.full_name, 80);
    const requestedBio = normalizeMultiline(req.body?.bio || user.bio, 300);
    const requestedShowEmail = normalizeBoolean(req.body?.showEmail, Boolean(user.show_email));
    const requestedProfilePrivate = normalizeBoolean(req.body?.profilePrivate, Boolean(user.profile_private));
    const requestedThemePreset = normalizeThemePreset(req.body?.themePreset || user.theme_preset);

    let requestedAvatar = user.avatar_data_url;
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "avatarDataUrl")) {
      requestedAvatar = sanitizeAvatarDataUrl(req.body.avatarDataUrl);
    }
    if (normalizeBoolean(req.body?.avatarRemove, false)) {
      requestedAvatar = "";
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
    user.show_email = requestedShowEmail;
    user.profile_private = requestedProfilePrivate;
    user.theme_preset = requestedThemePreset;
    persistDb();
    addActivityLog("profile.update", req, user, {
      username: user.username,
      nickname: user.nickname,
      showEmail: user.show_email,
      profilePrivate: user.profile_private,
      themePreset: user.theme_preset
    });

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
  const user = req.currentUser;
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
  addActivityLog("profile.comment_created", req, user, { commentId: comment.id, text: comment.text.slice(0, 80) });

  return res.status(201).json({ ok: true, comment, comments: user.comments });
});

app.delete("/api/users/:username/comments/:commentId", requireAuth, (req, res) => {
  const rawUsername = String(req.params.username || "").trim();
  const normalizedUsername = normalizeUsername(rawUsername);
  let targetUser = normalizedUsername ? findUserByUsername(normalizedUsername) : null;

  if (!targetUser && /^\d+$/.test(rawUsername)) {
    targetUser = findUserById(Number(rawUsername));
  }
  if (!targetUser) {
    return res.status(404).json({ error: "Профиль не найден." });
  }

  const actor = req.currentUser;
  if (!canModerateProfileComments(actor, targetUser)) {
    return res.status(403).json({ error: "Недостаточно прав для удаления комментариев." });
  }

  const commentId = Number(req.params.commentId);
  if (!Number.isFinite(commentId) || commentId <= 0) {
    return res.status(400).json({ error: "Некорректный комментарий." });
  }

  const before = targetUser.comments.length;
  targetUser.comments = targetUser.comments.filter((item) => Number(item.id) !== commentId);
  if (targetUser.comments.length === before) {
    return res.status(404).json({ error: "Комментарий не найден." });
  }

  persistDb();
  addActivityLog("profile.comment_deleted", req, actor, {
    targetUserId: targetUser.id,
    commentId
  }, targetUser.id);

  return res.json({
    ok: true,
    comments: targetUser.comments,
    canDeleteComments: canModerateProfileComments(actor, targetUser)
  });
});

app.get("/api/admin/overview", requireAuth, requireAdmin, (req, res) => {
  const totalUsers = db.users.length;
  const adminUsers = db.users.filter((item) => userHasPermission(item, "admin.panel")).length;
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const dayAgo = Date.now() - 1000 * 60 * 60 * 24;
  const newUsers7d = db.users.filter((item) => new Date(item.created_at).getTime() >= weekAgo).length;
  const active24h = db.users.filter((item) => {
    const ts = item.last_active_at ? new Date(item.last_active_at).getTime() : 0;
    return Number.isFinite(ts) && ts >= dayAgo;
  }).length;
  const bannedUsers = db.users.filter((item) => isUserBanned(item)).length;
  const commentsTotal = db.users.reduce((acc, item) => acc + item.comments.length, 0);

  addActivityLog("admin.overview_view", req, req.currentUser);

  return res.json({
    ok: true,
    stats: {
      totalUsers,
      adminUsers,
      newUsers7d,
      active24h,
      bannedUsers,
      commentsTotal,
      rolesTotal: db.roles.length
    }
  });
});

app.get("/api/admin/users", requireAuth, requireAdmin, requirePermission("users.manage"), (req, res) => {
  let changed = false;
  db.users.forEach((item) => {
    if (clearExpiredBan(item)) {
      changed = true;
    }
  });
  if (changed) {
    persistDb();
  }

  const users = db.users.map((item) => ({
    role: resolveUserRole(item),
    roleLabel: getRoleLabel(resolveUserRole(item)),
    roleStyle: getRoleStyle(resolveUserRole(item)),
    id: item.id,
    email: item.email,
    username: item.username,
    nickname: item.nickname,
    fullName: item.full_name,
    commentsCount: item.comments.length,
    createdAt: item.created_at,
    lastLoginAt: item.last_login_at,
    lastActiveAt: item.last_active_at,
    bannedUntil: item.banned_until,
    banReason: item.ban_reason,
    isBanned: isUserBanned(item)
  }));

  addActivityLog("admin.users_view", req, req.currentUser);

  return res.json({ ok: true, users });
});

app.get("/api/admin/roles", requireAuth, requireAdmin, (req, res) => {
  addActivityLog("admin.roles_view", req, req.currentUser);
  return res.json({ ok: true, roles: db.roles.map((role) => normalizeRole(role)) });
});

app.post("/api/admin/roles", requireAuth, requireAdmin, requirePermission("roles.manage"), (req, res) => {
  const name = normalizeRoleName(req.body?.name || "");
  const label = normalizeText(req.body?.label || name, 40);
  const permissions = normalizePermissions(req.body?.permissions);
  const colors = normalizeRoleColors(req.body?.colorPrimary, req.body?.colorSecondary, name);

  if (!ROLE_NAME_RE.test(name)) {
    return res.status(400).json({ error: "Некорректное имя роли. Используй a-z, 0-9, _ и -." });
  }
  if (findRoleByName(name)) {
    return res.status(409).json({ error: "Роль с таким именем уже существует." });
  }

  const role = normalizeRole({
    name,
    label,
    permissions,
    color_primary: colors.primary,
    color_secondary: colors.secondary,
    system: false,
    created_at: nowIso()
  });

  db.roles.push(role);
  persistDb();
  addActivityLog("admin.role_created", req, req.currentUser, {
    role: role.name,
    permissions: role.permissions,
    colorPrimary: role.color_primary,
    colorSecondary: role.color_secondary
  });
  return res.status(201).json({ ok: true, role });
});

app.delete("/api/admin/roles/:name", requireAuth, requireAdmin, requirePermission("roles.manage"), (req, res) => {
  const roleName = normalizeRoleName(req.params.name || "");
  const role = findRoleByName(roleName);
  if (!role) {
    return res.status(404).json({ error: "Роль не найдена." });
  }
  if (role.system || role.name === OWNER_ROLE || role.name === DEFAULT_ROLE || role.name === "admin") {
    return res.status(400).json({ error: "Системную роль удалить нельзя." });
  }

  const hasUsers = db.users.some((item) => resolveUserRole(item) === role.name);
  if (hasUsers) {
    return res.status(400).json({ error: "Нельзя удалить роль, пока она назначена пользователям." });
  }

  db.roles = db.roles.filter((item) => item.name !== role.name);
  persistDb();
  addActivityLog("admin.role_deleted", req, req.currentUser, { role: role.name });
  return res.json({ ok: true });
});

app.patch("/api/admin/users/:id/role", requireAuth, requireAdmin, requirePermission("users.manage"), (req, res) => {
  const targetId = Number(req.params.id);
  const role = normalizeRoleName(req.body?.role || DEFAULT_ROLE);

  const target = findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }
  if (!findRoleByName(role)) {
    return res.status(400).json({ error: "Роль не существует." });
  }

  const actor = req.currentUser;
  if (!actor) {
    return res.status(403).json({ error: "Недостаточно прав." });
  }

  if (isOwnerEmail(target.email) && !isOwnerEmail(actor.email)) {
    return res.status(403).json({ error: "Нельзя менять роль главного администратора." });
  }

  if (role === OWNER_ROLE && !isOwnerEmail(target.email)) {
    return res.status(403).json({ error: "Роль owner закреплена за главным админом." });
  }

  if (isOwnerEmail(target.email) && role !== OWNER_ROLE) {
    return res.status(403).json({ error: "Нельзя менять роль главного администратора." });
  }

  if (target.id === actor.id && role !== resolveUserRole(actor) && !isOwnerEmail(actor.email)) {
    return res.status(400).json({ error: "Нельзя понизить свою роль." });
  }

  target.role = role;
  ensureAdminForEmail(target.email);
  persistDb();

  addActivityLog("admin.user_role_updated", req, actor, {
    targetUserId: target.id,
    role: target.role
  }, target.id);

  return res.json({
    ok: true,
    user: {
      id: target.id,
      role: resolveUserRole(target)
    }
  });
});

app.delete("/api/admin/users/:id", requireAuth, requireAdmin, requirePermission("users.manage"), (req, res) => {
  const targetId = Number(req.params.id);
  const target = findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }

  const actor = req.currentUser;
  if (!actor) {
    return res.status(403).json({ error: "Недостаточно прав." });
  }

  if (target.id === actor.id) {
    return res.status(400).json({ error: "Нельзя удалить свой аккаунт из админки." });
  }

  if (isOwnerEmail(target.email)) {
    return res.status(403).json({ error: "Нельзя удалить главного администратора." });
  }

  db.users = db.users.filter((item) => item.id !== target.id);
  db.password_reset_tokens = db.password_reset_tokens.filter((item) => item.user_id !== target.id);
  db.user_messages = db.user_messages.filter((item) => Number(item.user_id) !== Number(target.id));
  persistDb();

  addActivityLog("admin.user_deleted", req, actor, {
    targetUserId: target.id,
    targetEmail: target.email
  }, target.id);

  return res.json({ ok: true });
});

app.post("/api/admin/users/:id/ban", requireAuth, requireAdmin, requirePermission("ban.manage"), (req, res) => {
  const targetId = Number(req.params.id);
  const minutes = Number(req.body?.minutes || 0);
  const reason = normalizeText(req.body?.reason || "", 180);
  const target = findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60 * 24 * 30) {
    return res.status(400).json({ error: "Укажи срок бана в минутах (1..43200)." });
  }

  const actor = req.currentUser;
  if (!actor) {
    return res.status(403).json({ error: "Недостаточно прав." });
  }

  if (target.id === actor.id) {
    return res.status(400).json({ error: "Нельзя забанить самого себя." });
  }
  if (isOwnerEmail(target.email)) {
    return res.status(403).json({ error: "Нельзя банить главного администратора." });
  }

  const bannedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  target.banned_until = bannedUntil;
  target.ban_reason = reason;
  target.banned_by = actor.id;
  persistDb();

  addActivityLog("admin.user_banned", req, actor, {
    targetUserId: target.id,
    bannedUntil,
    reason
  }, target.id);

  return res.json({
    ok: true,
    user: {
      id: target.id,
      bannedUntil: target.banned_until,
      banReason: target.ban_reason
    }
  });
});

app.post("/api/admin/users/:id/unban", requireAuth, requireAdmin, requirePermission("ban.manage"), (req, res) => {
  const targetId = Number(req.params.id);
  const target = findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }

  target.banned_until = null;
  target.ban_reason = "";
  target.banned_by = 0;
  persistDb();

  addActivityLog("admin.user_unbanned", req, req.currentUser, { targetUserId: target.id }, target.id);

  return res.json({
    ok: true,
    user: {
      id: target.id,
      bannedUntil: null
    }
  });
});

app.get("/api/admin/activity", requireAuth, requireAdmin, requirePermission("activity.view"), (req, res) => {
  const limitRaw = Number(req.query.limit || 80);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 300) : 80;
  const initialLength = db.activity_logs.length;
  db.activity_logs = db.activity_logs.filter((item) => item.event !== "admin.activity_view");
  if (db.activity_logs.length !== initialLength) {
    persistDb();
  }
  const activity = db.activity_logs.slice(-limit).reverse();

  return res.json({ ok: true, activity });
});

app.get("/auth", (req, res) => {
  const user = req.user ? findUserById(req.user.id) : null;
  addActivityLog("page.auth", req, user);
  res.sendFile(path.join(__dirname, "public", "auth", "index.html"));
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  const user = findUserById(req.user?.id);
  if (!user || isUserBanned(user)) {
    return res.redirect("/auth");
  }
  addActivityLog("page.profile", req, user);
  return res.sendFile(path.join(__dirname, "public", "profile", "index.html"));
});

app.get("/u/:username", (req, res) => {
  const actor = req.user ? findUserById(req.user?.id) : null;
  addActivityLog("page.profile_public", req, actor, {
    username: normalizeUsername(req.params.username || "")
  });
  return res.sendFile(path.join(__dirname, "public", "profile", "index.html"));
});

app.get("/members", (req, res) => {
  const actor = req.user ? findUserById(req.user?.id) : null;
  addActivityLog("page.members", req, actor);
  return res.sendFile(path.join(__dirname, "public", "members", "index.html"));
});

app.get("/news", (req, res) => {
  const actor = req.user ? findUserById(req.user?.id) : null;
  addActivityLog("page.news", req, actor);
  return res.sendFile(path.join(__dirname, "public", "news", "index.html"));
});

app.get("/messages", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth");
  }

  const user = findUserById(req.user?.id);
  if (!user || isUserBanned(user)) {
    return res.redirect("/auth");
  }

  addActivityLog("page.messages", req, user);
  return res.sendFile(path.join(__dirname, "public", "messages", "index.html"));
});

app.get("/admin", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  const user = findUserById(req.user?.id);
  if (!user || isUserBanned(user) || !userHasPermission(user, "admin.panel")) {
    return res.redirect("/profile");
  }
  addActivityLog("page.admin", req, user);
  return res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

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
