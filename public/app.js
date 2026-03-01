const ui = {
  versionText: document.getElementById("versionText"),
  statusLine: document.getElementById("statusLine"),
  registerForm: document.getElementById("registerForm"),
  loginForm: document.getElementById("loginForm"),
  profilePanel: document.getElementById("profilePanel"),
  profileName: document.getElementById("profileName"),
  profileEmail: document.getElementById("profileEmail"),
  profileRole: document.getElementById("profileRole"),
  profileId: document.getElementById("profileId"),
  logoutBtn: document.getElementById("logoutBtn"),
  langSelect: document.getElementById("langSelect")
};

const DEFAULT_LANG = "ru";
const LANG_STORAGE_KEY = "kimpintyao_lang";

const TRANSLATIONS = {
  ru: {
    meta: {
      mainTitle: "KimpintyaoVisual | Java Visual Pack",
      authTitle: "KimpintyaoVisual | Вход"
    },
    nav: {
      features: "Преимущества",
      modes: "Режимы",
      story: "Визуальная история"
    },
    lang: {
      label: "Язык"
    },
    auth: {
      login: "Вход",
      nav: {
        home: "Главная",
        features: "Преимущества",
        modes: "Режимы"
      },
      hero: {
        title: "вход и регистрация",
        lead: "Создай аккаунт, чтобы получать новости проекта и доступ к новым версиям визуала."
      },
      quick: {
        title: "Быстрые действия",
        home: "Главная",
        features: "Преимущества"
      },
      register: {
        title: "Регистрация",
        username: "Ник",
        usernamePlaceholder: "Например: Kimpintyao",
        password: "Пароль",
        passwordPlaceholder: "Минимум 6 символов",
        button: "Зарегистрироваться"
      },
      loginTitle: "Вход",
      loginPasswordLabel: "Пароль",
      loginPasswordPlaceholder: "Твой пароль",
      loginButton: "Войти",
      profile: {
        title: "Текущий аккаунт",
        username: "Ник:",
        role: "Роль:",
        home: "На главную",
        logout: "Выйти"
      },
      status: {
        ready: "Вкладка аккаунта готова."
      },
      footer: {
        copy: "KimpintyaoVisual • Account Access • 2026"
      }
    },
    hero: {
      kicker: "Minecraft Visual Pack",
      lead: "Пак визуала в стиле cinematic для Minecraft Java Edition. Сейчас доступна ранняя версия v0.1 (Разработка визуала): обновленный свет, атмосфера, глубина сцены и пресеты под разный стиль игры.",
      actions: {
        modes: "Смотреть режимы",
        account: "Войти в аккаунт"
      },
      metrics: {
        presets: "цветовых пресетов",
        modes: "режима производительности",
        stage: "текущий этап разработки"
      }
    },
    status: {
      title: "Состояние проекта",
      items: {
        status: "Статус",
        statusValue: "Closed Beta",
        version: "Версия",
        stage: "Стадия",
        stageValue: "Разработка",
        platform: "Платформа",
        platformValue: "Java Edition"
      }
    },
    features: {
      title: "Почему KimpintyaoVisual",
      subtitle: "Тонкая работа со светом, цветом и контрастом для атмосферного Minecraft Java без перегруженных эффектов.",
      depth: {
        1: "Мягкие тени в лесах, пещерах и на открытых локациях.",
        2: "Подчеркивание объема блоков и читаемости рельефа.",
        3: "Плавный переход между рассветом, днем и ночью."
      },
      color: {
        1: "Киношная палитра для биомов без пересвета.",
        2: "Контроль насыщенности и теплоты кадра.",
        3: "Готовые профили для PvP, Survival и вечерних сцен."
      },
      performance: {
        1: "Оптимизация под слабые и средние ПК.",
        2: "Переключение профилей одним кликом.",
        3: "Стабильный FPS даже в насыщенных сценах."
      }
    },
    modes: {
      title: "Режимы визуала",
      subtitle: "Выбирай баланс между cinematic-подачей и производительностью.",
      lite: "Минимальная нагрузка, чистая картинка и максимальный FPS.",
      balanced: "Оптимальный профиль для повседневной игры и записи контента.",
      cinematic: "Максимальная глубина сцены, мягкое свечение и выразительные акценты."
    },
    story: {
      title: "Как строится визуальная сцена",
      subtitle: "Ниже путь кадра от базового света до финального cinematic результата.",
      step1: {
        title: "Базовая глубина",
        text: "На первом этапе настраивается тон и читаемость мира: глубина тумана, контраст неба и баланс светлых блоков."
      },
      step2: {
        title: "Световые акценты",
        text: "Добавляются мягкие блики, теплые источники света и тонкая подсветка объектов, чтобы сцена выглядела объемно."
      },
      step3: {
        title: "Цветокоррекция",
        text: "Палитра выравнивается под биомы: холодные ночи, теплые закаты и нейтральные дневные сцены без кислотности."
      },
      step4: {
        title: "Финальный пресет",
        text: "Финальный этап собирает все слои в готовый профиль: PvP, Survival или Cinematic для скриншотов и видео."
      }
    },
    notes: {
      title: "Больше про визуал",
      subtitle: "Подробности о том, как пакет ведет себя в разных сценах и почему картинка выглядит плавно.",
      item1: {
        title: "Лес и дальние планы",
        text: "В густых лесах свет не проваливается в темные пятна: используется мягкое затухание и аккуратная передача дальнего плана."
      },
      item2: {
        title: "Пещеры и подземелья",
        text: "Локальные источники света подчеркивают форму стен и руды, сохраняя читаемость без избыточного блум-эффекта."
      },
      item3: {
        title: "Закат и ночь",
        text: "Вечерние тона плавно переходят в ночные, а небесная палитра сохраняет атмосферу без резкой смены контраста."
      },
      item4: {
        title: "Сцены для контента",
        text: "В профиле Cinematic упор на красивый кадр: мягкие полутона, контролируемая насыщенность и ровные переходы в движении."
      }
    },
    roadmap: {
      subtitle: "Что планируется в ближайших обновлениях визуала.",
      core: "Базовый пакет освещения, небо, туман и цветокоррекция.",
      engine: "Сцены PvP / Survival / Night и быстрые переключения между профилями.",
      creator: "Отдельные пресеты для скриншотов, reels и YouTube-контента."
    },
    faq: {
      q1: "Когда выйдет открытая версия?",
      a1: "После завершения этапа v0.1 и сбора фидбека с закрытого теста.",
      q2: "Нужен мощный ПК?",
      a2: "Нет. Режим Lite рассчитан на более слабые конфигурации.",
      q3: "Как получить ранний доступ?",
      a3: "Создать аккаунт во вкладке «Вход» и следить за новостями проекта."
    },
    cta: {
      title: "Готов улучшить картинку Minecraft Java?",
      subtitle: "Войди в аккаунт и получай обновления KimpintyaoVisual по мере развития визуальных сцен.",
      button: "Перейти к входу"
    },
    footer: {
      copy: "KimpintyaoVisual • Java Visual Project • 2026"
    },
    messages: {
      accountCreated: "Аккаунт создан.",
      loginSuccess: "Вход выполнен.",
      logoutSuccess: "Вы вышли из аккаунта."
    }
  },
  en: {
    meta: {
      mainTitle: "KimpintyaoVisual | Java Visual Pack",
      authTitle: "KimpintyaoVisual | Sign In"
    },
    nav: {
      features: "Features",
      modes: "Modes",
      story: "Visual Story"
    },
    lang: {
      label: "Language"
    },
    auth: {
      login: "Sign In",
      nav: {
        home: "Home",
        features: "Features",
        modes: "Modes"
      },
      hero: {
        title: "sign in and registration",
        lead: "Create an account to receive project news and access to upcoming visual releases."
      },
      quick: {
        title: "Quick Actions",
        home: "Home",
        features: "Features"
      },
      register: {
        title: "Registration",
        username: "Username",
        usernamePlaceholder: "Example: Kimpintyao",
        password: "Password",
        passwordPlaceholder: "Minimum 6 characters",
        button: "Create account"
      },
      loginTitle: "Sign In",
      loginPasswordLabel: "Password",
      loginPasswordPlaceholder: "Your password",
      loginButton: "Log in",
      profile: {
        title: "Current account",
        username: "Username:",
        role: "Role:",
        home: "Back to home",
        logout: "Sign out"
      },
      status: {
        ready: "Account tab is ready."
      },
      footer: {
        copy: "KimpintyaoVisual • Account Access • 2026"
      }
    },
    hero: {
      kicker: "Minecraft Visual Pack",
      lead: "A cinematic visual pack for Minecraft Java Edition. Early build v0.1 is now available with updated lighting, atmosphere, scene depth, and presets for different play styles.",
      actions: {
        modes: "View modes",
        account: "Open account"
      },
      metrics: {
        presets: "color presets",
        modes: "performance modes",
        stage: "current development stage"
      }
    },
    status: {
      title: "Project status",
      items: {
        status: "Status",
        statusValue: "Closed Beta",
        version: "Version",
        stage: "Stage",
        stageValue: "In development",
        platform: "Platform",
        platformValue: "Java Edition"
      }
    },
    features: {
      title: "Why KimpintyaoVisual",
      subtitle: "Precise lighting, color, and contrast tuning for atmospheric Minecraft Java visuals without overloading effects.",
      depth: {
        1: "Soft shadows in forests, caves, and open areas.",
        2: "Clear block depth and terrain readability.",
        3: "Smooth transitions between dawn, day, and night."
      },
      color: {
        1: "Cinematic biome palette without blown highlights.",
        2: "Saturation and warmth control.",
        3: "Ready-made profiles for PvP, Survival, and evening scenes."
      },
      performance: {
        1: "Optimized for low and mid-range PCs.",
        2: "One-click quality profile switching.",
        3: "Stable FPS in heavy scenes."
      }
    },
    modes: {
      title: "Visual modes",
      subtitle: "Choose your balance between cinematic look and performance.",
      lite: "Minimal load, clean image, and maximum FPS.",
      balanced: "Best profile for everyday gameplay and content capture.",
      cinematic: "Maximum scene depth, smooth glow, and expressive accents."
    },
    story: {
      title: "How the visual scene is built",
      subtitle: "A step-by-step path from base lighting to final cinematic output.",
      step1: {
        title: "Base depth",
        text: "The first pass sets world tone and readability: fog depth, sky contrast, and bright block balance."
      },
      step2: {
        title: "Light accents",
        text: "Soft highlights, warm light sources, and subtle object glow make the scene feel volumetric."
      },
      step3: {
        title: "Color grading",
        text: "Palette is balanced per biome: cool nights, warm sunsets, and neutral daytime scenes."
      },
      step4: {
        title: "Final preset",
        text: "All layers are merged into ready profiles: PvP, Survival, or Cinematic for screenshots and video."
      }
    },
    notes: {
      title: "More about visuals",
      subtitle: "Details on how the pack behaves across different scene types and why motion feels smooth.",
      item1: {
        title: "Forests and long shots",
        text: "Dense forests keep depth without dark clipping thanks to soft attenuation and long-range balancing."
      },
      item2: {
        title: "Caves and underground",
        text: "Local light sources shape walls and ores while preserving readability without aggressive bloom."
      },
      item3: {
        title: "Sunset and night",
        text: "Evening tones smoothly flow into night, keeping atmosphere without abrupt contrast jumps."
      },
      item4: {
        title: "Creator scenes",
        text: "Cinematic profile focuses on beautiful framing: smooth midtones, controlled saturation, and stable transitions."
      }
    },
    roadmap: {
      subtitle: "What is planned for upcoming visual updates.",
      core: "Core package: lighting, sky, fog, and color correction.",
      engine: "PvP / Survival / Night scenes with fast profile switching.",
      creator: "Dedicated presets for screenshots, reels, and YouTube content."
    },
    faq: {
      q1: "When will the open version be released?",
      a1: "After v0.1 is completed and closed beta feedback is processed.",
      q2: "Do I need a powerful PC?",
      a2: "No. Lite mode targets weaker configurations.",
      q3: "How do I get early access?",
      a3: "Create an account on the sign-in page and follow project updates."
    },
    cta: {
      title: "Ready to upgrade Minecraft Java visuals?",
      subtitle: "Sign in to receive KimpintyaoVisual updates as the visual pipeline evolves.",
      button: "Go to sign in"
    },
    footer: {
      copy: "KimpintyaoVisual • Java Visual Project • 2026"
    },
    messages: {
      accountCreated: "Account created.",
      loginSuccess: "Logged in successfully.",
      logoutSuccess: "You have signed out."
    }
  },
  uk: {
    meta: {
      mainTitle: "KimpintyaoVisual | Java Visual Pack",
      authTitle: "KimpintyaoVisual | Вхід"
    },
    nav: {
      features: "Переваги",
      modes: "Режими",
      story: "Візуальна історія"
    },
    lang: {
      label: "Мова"
    },
    auth: {
      login: "Вхід",
      nav: {
        home: "Головна",
        features: "Переваги",
        modes: "Режими"
      },
      hero: {
        title: "вхід і реєстрація",
        lead: "Створи акаунт, щоб отримувати новини проєкту та доступ до нових версій візуалу."
      },
      quick: {
        title: "Швидкі дії",
        home: "Головна",
        features: "Переваги"
      },
      register: {
        title: "Реєстрація",
        username: "Нік",
        usernamePlaceholder: "Наприклад: Kimpintyao",
        password: "Пароль",
        passwordPlaceholder: "Мінімум 6 символів",
        button: "Зареєструватися"
      },
      loginTitle: "Вхід",
      loginPasswordLabel: "Пароль",
      loginPasswordPlaceholder: "Твій пароль",
      loginButton: "Увійти",
      profile: {
        title: "Поточний акаунт",
        username: "Нік:",
        role: "Роль:",
        home: "На головну",
        logout: "Вийти"
      },
      status: {
        ready: "Вкладка акаунта готова."
      },
      footer: {
        copy: "KimpintyaoVisual • Account Access • 2026"
      }
    },
    hero: {
      kicker: "Minecraft Visual Pack",
      lead: "Cinematic-пак візуалу для Minecraft Java Edition. Доступна рання версія v0.1 з оновленим світлом, атмосферою, глибиною сцени та пресетами під різні стилі гри.",
      actions: {
        modes: "Дивитися режими",
        account: "Увійти в акаунт"
      },
      metrics: {
        presets: "кольорових пресетів",
        modes: "режими продуктивності",
        stage: "поточний етап розробки"
      }
    },
    status: {
      title: "Стан проєкту",
      items: {
        status: "Статус",
        statusValue: "Closed Beta",
        version: "Версія",
        stage: "Стадія",
        stageValue: "Розробка",
        platform: "Платформа",
        platformValue: "Java Edition"
      }
    },
    features: {
      title: "Чому KimpintyaoVisual",
      subtitle: "Точна робота зі світлом, кольором і контрастом для атмосферного Minecraft Java без перевантажених ефектів.",
      depth: {
        1: "М'які тіні в лісах, печерах і відкритих локаціях.",
        2: "Підкреслення об'єму блоків і читабельності рельєфу.",
        3: "Плавний перехід між світанком, днем і ніччю."
      },
      color: {
        1: "Кінематографічна палітра для біомів без пересвітів.",
        2: "Контроль насиченості та теплоти кадру.",
        3: "Готові профілі для PvP, Survival і вечірніх сцен."
      },
      performance: {
        1: "Оптимізація для слабких і середніх ПК.",
        2: "Перемикання профілів в один клік.",
        3: "Стабільний FPS навіть у насичених сценах."
      }
    },
    modes: {
      title: "Режими візуалу",
      subtitle: "Обери баланс між cinematic-подачею і продуктивністю.",
      lite: "Мінімальне навантаження, чиста картинка та максимальний FPS.",
      balanced: "Оптимальний профіль для щоденної гри та запису контенту.",
      cinematic: "Максимальна глибина сцени, м'яке сяйво та виразні акценти."
    },
    story: {
      title: "Як будується візуальна сцена",
      subtitle: "Шлях кадру від базового світла до фінального cinematic-результату.",
      step1: {
        title: "Базова глибина",
        text: "На першому етапі налаштовується тон і читабельність світу: глибина туману, контраст неба та баланс світлих блоків."
      },
      step2: {
        title: "Світлові акценти",
        text: "Додаються м'які відблиски, теплі джерела світла та тонке підсвічування об'єктів."
      },
      step3: {
        title: "Кольорокорекція",
        text: "Палітра вирівнюється під біоми: холодні ночі, теплі заходи сонця та нейтральні денні сцени."
      },
      step4: {
        title: "Фінальний пресет",
        text: "У фіналі всі шари збираються в готовий профіль: PvP, Survival або Cinematic для скріншотів і відео."
      }
    },
    notes: {
      title: "Більше про візуал",
      subtitle: "Деталі про те, як пак поводиться в різних сценах і чому картинка виглядає плавно.",
      item1: {
        title: "Ліс і дальні плани",
        text: "У густих лісах світло не провалюється в темні плями: використовується м'яке згасання та акуратна передача дальнього плану."
      },
      item2: {
        title: "Печери й підземелля",
        text: "Локальні джерела світла підкреслюють форму стін і руди без надмірного bloom-ефекту."
      },
      item3: {
        title: "Захід сонця і ніч",
        text: "Вечірні тони плавно переходять у нічні, зберігаючи атмосферу без різких стрибків контрасту."
      },
      item4: {
        title: "Сцени для контенту",
        text: "У Cinematic-профілі акцент на красивому кадрі: м'які півтони, контрольована насиченість і рівні переходи в русі."
      }
    },
    roadmap: {
      subtitle: "Що планується в найближчих оновленнях візуалу.",
      core: "Базовий пакет освітлення, небо, туман і кольорокорекція.",
      engine: "Сцени PvP / Survival / Night і швидке перемикання профілів.",
      creator: "Окремі пресети для скріншотів, reels і YouTube-контенту."
    },
    faq: {
      q1: "Коли вийде відкрита версія?",
      a1: "Після завершення етапу v0.1 та збору фідбеку із закритого тесту.",
      q2: "Потрібен потужний ПК?",
      a2: "Ні. Режим Lite розрахований на слабші конфігурації.",
      q3: "Як отримати ранній доступ?",
      a3: "Створи акаунт у вкладці «Вхід» і стеж за новинами проєкту."
    },
    cta: {
      title: "Готовий покращити картинку Minecraft Java?",
      subtitle: "Увійди в акаунт і отримуй оновлення KimpintyaoVisual у міру розвитку візуальних сцен.",
      button: "Перейти до входу"
    },
    footer: {
      copy: "KimpintyaoVisual • Java Visual Project • 2026"
    },
    messages: {
      accountCreated: "Акаунт створено.",
      loginSuccess: "Вхід виконано.",
      logoutSuccess: "Ви вийшли з акаунта."
    }
  }
};

let currentLang = DEFAULT_LANG;

function isAuthPage() {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  return pathname === "/auth";
}

function getValueByPath(source, path) {
  return String(path || "")
    .split(".")
    .reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, source);
}

function t(path) {
  return getValueByPath(TRANSLATIONS[currentLang], path)
    ?? getValueByPath(TRANSLATIONS[DEFAULT_LANG], path)
    ?? path;
}

function setStatus(text, isError = false) {
  if (!ui.statusLine) {
    return;
  }
  ui.statusLine.textContent = text;
  ui.statusLine.classList.toggle("error", isError);
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = isAuthPage() ? t("meta.authTitle") : t("meta.mainTitle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (!key) {
      return;
    }
    node.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (!key) {
      return;
    }
    node.setAttribute("placeholder", t(key));
  });
}

function setupLanguage() {
  const browserLang = String(navigator.language || "").slice(0, 2).toLowerCase();
  const saved = localStorage.getItem(LANG_STORAGE_KEY);

  if (saved && TRANSLATIONS[saved]) {
    currentLang = saved;
  } else if (TRANSLATIONS[browserLang]) {
    currentLang = browserLang;
  }

  if (ui.langSelect) {
    ui.langSelect.value = currentLang;
    ui.langSelect.addEventListener("change", () => {
      const nextLang = ui.langSelect.value;
      if (!TRANSLATIONS[nextLang]) {
        return;
      }
      currentLang = nextLang;
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      applyTranslations();
    });
  }

  applyTranslations();
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Ошибка ${response.status}`);
  }

  return data;
}

function setupRevealAnimation() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            entry.target.classList.add("visible");
          });
        }, delay);

        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

function renderUser(user) {
  if (!ui.profilePanel) {
    return;
  }

  if (!user) {
    ui.profilePanel.hidden = true;
    return;
  }

  ui.profileName.textContent = user.username;
  ui.profileEmail.textContent = user.email;
  ui.profileRole.textContent = user.role;
  ui.profileId.textContent = String(user.id);
  ui.profilePanel.hidden = false;
}

function bindAuthHandlers() {
  if (ui.registerForm) {
    ui.registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(ui.registerForm);
      const payload = {
        username: String(formData.get("username") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      };

      try {
        await api("/api/auth/register", {
          method: "POST",
          body: payload
        });
        ui.registerForm.reset();
        setStatus(t("messages.accountCreated"));
        window.location.href = "/";
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.loginForm) {
    ui.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(ui.loginForm);
      const payload = {
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      };

      try {
        await api("/api/auth/login", {
          method: "POST",
          body: payload
        });
        ui.loginForm.reset();
        setStatus(t("messages.loginSuccess"));
        window.location.href = "/";
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.logoutBtn) {
    ui.logoutBtn.addEventListener("click", async () => {
      try {
        await api("/api/auth/logout", { method: "POST" });
        renderUser(null);
        setStatus(t("messages.logoutSuccess"));
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }
}

async function bootstrap() {
  setupLanguage();
  setupRevealAnimation();
  bindAuthHandlers();

  try {
    const [config, me] = await Promise.all([api("/api/config"), api("/api/auth/me")]);

    if (config.version && ui.versionText) {
      ui.versionText.textContent = `v${config.version}`;
    }

    if (isAuthPage()) {
      renderUser(me.authenticated ? me.user : null);
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

bootstrap();
