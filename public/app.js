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
const PROFILE_BUTTON_TEXT = {
  ru: "Профиль",
  en: "Profile",
  uk: "Профіль"
};
const ADMIN_BUTTON_TEXT = {
  ru: "Админка",
  en: "Admin",
  uk: "Адмінка"
};
const CLIENT_ADMIN_EMAILS = new Set(["stepaneartem47@gmail.com"]);
const CLIENT_OWNER_EMAIL = "stepaneartem47@gmail.com";
const PROFILE_TITLE_TEXT = {
  ru: "KimpintyaoVisual | Профиль",
  en: "KimpintyaoVisual | Profile",
  uk: "KimpintyaoVisual | Профіль"
};
const ADMIN_TITLE_TEXT = {
  ru: "KimpintyaoVisual | Админка",
  en: "KimpintyaoVisual | Admin",
  uk: "KimpintyaoVisual | Адмінка"
};
const MEMBERS_TITLE_TEXT = {
  ru: "KimpintyaoVisual | Участники",
  en: "KimpintyaoVisual | Members",
  uk: "KimpintyaoVisual | Учасники"
};
const NEWS_TITLE_TEXT = {
  ru: "KimpintyaoVisual | Новости",
  en: "KimpintyaoVisual | News",
  uk: "KimpintyaoVisual | Новини"
};
const MESSAGES_TITLE_TEXT = {
  ru: "KimpintyaoVisual | Сообщения",
  en: "KimpintyaoVisual | Messages",
  uk: "KimpintyaoVisual | Повідомлення"
};
const PROFILE_STATUS_TEXT = {
  loaded: {
    ru: "Профиль загружен.",
    en: "Profile loaded.",
    uk: "Профіль завантажено."
  },
  saved: {
    ru: "Профиль сохранен.",
    en: "Profile saved.",
    uk: "Профіль збережено."
  },
  commentAdded: {
    ru: "Комментарий добавлен.",
    en: "Comment added.",
    uk: "Коментар додано."
  }
};
const ADMIN_STATUS_TEXT = {
  loaded: {
    ru: "Админка загружена.",
    en: "Admin panel loaded.",
    uk: "Адмінку завантажено."
  },
  roleUpdated: {
    ru: "Роль пользователя обновлена.",
    en: "User role updated.",
    uk: "Роль користувача оновлено."
  },
  roleCreated: {
    ru: "Роль создана.",
    en: "Role created.",
    uk: "Роль створено."
  },
  roleDeleted: {
    ru: "Роль удалена.",
    en: "Role deleted.",
    uk: "Роль видалено."
  },
  userDeleted: {
    ru: "Аккаунт удален.",
    en: "Account deleted.",
    uk: "Акаунт видалено."
  },
  userBanned: {
    ru: "Пользователь забанен.",
    en: "User banned.",
    uk: "Користувача заблоковано."
  },
  userUnbanned: {
    ru: "Бан снят.",
    en: "Ban removed.",
    uk: "Блокування знято."
  }
};
const MEMBERS_STATUS_TEXT = {
  loaded: {
    ru: "Страница участников обновлена.",
    en: "Members page updated.",
    uk: "Сторінку учасників оновлено."
  }
};
const NEWS_STATUS_TEXT = {
  loaded: {
    ru: "Новости загружены.",
    en: "News loaded.",
    uk: "Новини завантажено."
  },
  created: {
    ru: "Новость опубликована и отправлена.",
    en: "News published and sent.",
    uk: "Новину опубліковано та надіслано."
  }
};
const MESSAGES_STATUS_TEXT = {
  loaded: {
    ru: "Сообщения загружены.",
    en: "Messages loaded.",
    uk: "Повідомлення завантажено."
  }
};

ui.navAuthBtn = document.getElementById("navAuthBtn");
ui.navAdminBtn = document.getElementById("navAdminBtn");
ui.navMessagesBtn = document.getElementById("navMessagesBtn");
ui.profilePageRoot = document.getElementById("profilePageRoot");
ui.profilePageUsername = document.getElementById("profilePageUsername");
ui.profilePageEmail = document.getElementById("profilePageEmail");
ui.profilePageRole = document.getElementById("profilePageRole");
ui.profilePageId = document.getElementById("profilePageId");
ui.profilePageDisplayName = document.getElementById("profilePageDisplayName");
ui.profilePageAvatar = document.getElementById("profilePageAvatar");
ui.profilePageKicker = document.getElementById("profilePageKicker");
ui.profilePageRolePill = document.getElementById("profilePageRolePill");
ui.profilePagePresence = document.getElementById("profilePagePresence");
ui.profilePageBio = document.getElementById("profilePageBio");
ui.profilePageCreatedAt = document.getElementById("profilePageCreatedAt");
ui.profilePageLastActive = document.getElementById("profilePageLastActive");
ui.profileStatComments = document.getElementById("profileStatComments");
ui.profileStatDays = document.getElementById("profileStatDays");
ui.profileStatActivity = document.getElementById("profileStatActivity");
ui.profileEditForm = document.getElementById("profileEditForm");
ui.profileEditUsername = document.getElementById("profileEditUsername");
ui.profileEditNickname = document.getElementById("profileEditNickname");
ui.profileEditFullName = document.getElementById("profileEditFullName");
ui.profileEditBio = document.getElementById("profileEditBio");
ui.profileAvatarFileInput = document.getElementById("profileAvatarFileInput");
ui.profileAvatarRemove = document.getElementById("profileAvatarRemove");
ui.profileEditShowEmail = document.getElementById("profileEditShowEmail");
ui.profileEditPrivate = document.getElementById("profileEditPrivate");
ui.profileEditTheme = document.getElementById("profileEditTheme");
ui.profileCommentForm = document.getElementById("profileCommentForm");
ui.profileCommentInput = document.getElementById("profileCommentInput");
ui.profileCommentList = document.getElementById("profileCommentList");
ui.profileCollections = document.getElementById("profileCollections");
ui.profileCollectionsCard = document.getElementById("profileCollectionsCard");
ui.profileLogoutBtn = document.getElementById("profileLogoutBtn");
ui.profileBackToSelfBtn = document.getElementById("profileBackToSelfBtn");
ui.profileViewHint = document.getElementById("profileViewHint");
ui.profileEditCard = document.getElementById("profileEditCard");
ui.profileCommentsCard = document.getElementById("profileCommentsCard");
ui.profileLookupForm = document.getElementById("profileLookupForm");
ui.profileLookupInput = document.getElementById("profileLookupInput");
ui.publicUsersGrid = document.getElementById("publicUsersGrid");
ui.adminPageRoot = document.getElementById("adminPageRoot");
ui.adminRefreshBtn = document.getElementById("adminRefreshBtn");
ui.adminLogoutBtn = document.getElementById("adminLogoutBtn");
ui.adminStatUsers = document.getElementById("adminStatUsers");
ui.adminStatAdmins = document.getElementById("adminStatAdmins");
ui.adminStatNew7d = document.getElementById("adminStatNew7d");
ui.adminStatActive24h = document.getElementById("adminStatActive24h");
ui.adminStatBanned = document.getElementById("adminStatBanned");
ui.adminStatComments = document.getElementById("adminStatComments");
ui.adminUsersBody = document.getElementById("adminUsersBody");
ui.adminRoleCreateForm = document.getElementById("adminRoleCreateForm");
ui.adminRoleNameInput = document.getElementById("adminRoleNameInput");
ui.adminRoleLabelInput = document.getElementById("adminRoleLabelInput");
ui.adminRolePermissionsInput = document.getElementById("adminRolePermissionsInput");
ui.adminRolePrimaryInput = document.getElementById("adminRolePrimaryInput");
ui.adminRoleSecondaryInput = document.getElementById("adminRoleSecondaryInput");
ui.adminRolesList = document.getElementById("adminRolesList");
ui.adminActivityRefreshBtn = document.getElementById("adminActivityRefreshBtn");
ui.adminActivityBody = document.getElementById("adminActivityBody");
ui.membersPageRoot = document.getElementById("membersPageRoot");
ui.membersTabs = document.getElementById("membersTabs");
ui.membersGrid = document.getElementById("membersGrid");
ui.membersCreatorsCount = document.getElementById("membersCreatorsCount");
ui.membersAdminsCount = document.getElementById("membersAdminsCount");
ui.membersModeratorsCount = document.getElementById("membersModeratorsCount");
ui.membersUsersCount = document.getElementById("membersUsersCount");
ui.newsPageRoot = document.getElementById("newsPageRoot");
ui.newsPublishCard = document.getElementById("newsPublishCard");
ui.newsCreateForm = document.getElementById("newsCreateForm");
ui.newsTitleInput = document.getElementById("newsTitleInput");
ui.newsTextInput = document.getElementById("newsTextInput");
ui.newsEditId = document.getElementById("newsEditId");
ui.newsTargetRolesInput = document.getElementById("newsTargetRolesInput");
ui.newsResendEmailInput = document.getElementById("newsResendEmailInput");
ui.newsSubmitBtn = document.getElementById("newsSubmitBtn");
ui.newsCancelEditBtn = document.getElementById("newsCancelEditBtn");
ui.newsList = document.getElementById("newsList");
ui.messagesPageRoot = document.getElementById("messagesPageRoot");
ui.messagesUnreadCount = document.getElementById("messagesUnreadCount");
ui.messagesTotalCount = document.getElementById("messagesTotalCount");
ui.messagesReadAllBtn = document.getElementById("messagesReadAllBtn");
ui.messagesList = document.getElementById("messagesList");

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
let currentUser = null;
let profileViewedUser = null;
let profileIsOwnView = false;
let profileCanDeleteComments = false;
let pendingProfileAvatarDataUrl = null;
let membersActiveTab = "creators";
let membersCache = null;
let membersAutoRefreshTimer = 0;
let newsAutoRefreshTimer = 0;
let messagesAutoRefreshTimer = 0;
let newsEditingId = 0;
let newsAudienceRolesCache = [];
let newsCache = [];
let adminUsersCache = [];
let adminRolesCache = [];
let adminActivityCache = [];

const THEME_PRESETS = new Set(["violet", "ocean", "emerald", "sunset"]);

function normalizePathname() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function isAuthPage() {
  return normalizePathname() === "/auth";
}

function isProfilePage() {
  return normalizePathname() === "/profile";
}

function isPublicProfilePage() {
  return normalizePathname().startsWith("/u/");
}

function isAnyProfilePage() {
  return isProfilePage() || isPublicProfilePage();
}

function getPublicProfileSlug() {
  if (!isPublicProfilePage()) {
    return "";
  }

  const raw = normalizePathname().slice(3);
  try {
    return decodeURIComponent(raw);
  } catch (error) {
    return raw;
  }
}

function isAdminPage() {
  return normalizePathname() === "/admin";
}

function isMembersPage() {
  return normalizePathname() === "/members";
}

function isNewsPage() {
  return normalizePathname() === "/news";
}

function isMessagesPage() {
  return normalizePathname() === "/messages";
}

function pickLocalized(map, fallback = "") {
  return map?.[currentLang] || map?.[DEFAULT_LANG] || fallback;
}

function getLoginHref() {
  return isAuthPage() ? "#loginForm" : "/auth";
}

function applyAuthButtonState() {
  if (!ui.navAuthBtn) {
    return;
  }

  if (currentUser) {
    ui.navAuthBtn.textContent = pickLocalized(PROFILE_BUTTON_TEXT, "Profile");
    ui.navAuthBtn.setAttribute("href", "/profile");
    return;
  }

  ui.navAuthBtn.textContent = t("auth.login");
  ui.navAuthBtn.setAttribute("href", getLoginHref());
}

function applyMessagesButtonState() {
  if (!ui.navMessagesBtn) {
    return;
  }

  const hasAuth = Boolean(currentUser);
  ui.navMessagesBtn.hidden = !hasAuth;
  if (hasAuth) {
    ui.navMessagesBtn.setAttribute("href", "/messages");
  }
}

function applyAdminButtonState() {
  if (!ui.navAdminBtn) {
    return;
  }

  const isAdmin = canAccessAdmin(currentUser);
  ui.navAdminBtn.hidden = !isAdmin;
  if (isAdmin) {
    ui.navAdminBtn.textContent = pickLocalized(ADMIN_BUTTON_TEXT, "Admin");
    ui.navAdminBtn.setAttribute("href", "/admin");
  }
}

function canPublishNews(user) {
  if (!user) {
    return false;
  }
  const role = normalizeRoleName(user.role || "");
  return role === "owner" || role === "admin";
}

function canAccessAdmin(user) {
  if (!user) {
    return false;
  }

  const email = String(user.email || "").trim().toLowerCase();
  const role = String(user.role || "").trim().toLowerCase();
  const perms = Array.isArray(user.rolePermissions) ? user.rolePermissions : [];

  if (email === CLIENT_OWNER_EMAIL) {
    return true;
  }

  return role === "admin" || role === "owner" || perms.includes("*") || perms.includes("admin.panel") || CLIENT_ADMIN_EMAILS.has(email);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatIsoDate(iso) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

function normalizeRoleName(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

function normalizeThemePreset(theme) {
  const normalized = String(theme || "")
    .trim()
    .toLowerCase();
  return THEME_PRESETS.has(normalized) ? normalized : "violet";
}

function applyThemePreset(theme) {
  const normalized = normalizeThemePreset(theme);
  document.documentElement.setAttribute("data-theme", normalized);
  return normalized;
}

function normalizeHexColor(value) {
  const normalized = String(value || "").trim();
  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) {
    return "";
  }
  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`.toLowerCase();
  }
  return normalized.toLowerCase();
}

function getRoleStyleCss(roleStyle) {
  const primary = normalizeHexColor(roleStyle?.primary);
  const secondary = normalizeHexColor(roleStyle?.secondary);
  if (!primary && !secondary) {
    return "";
  }

  const safePrimary = primary || secondary;
  const safeSecondary = secondary || primary || safePrimary;
  return [
    `border-color: ${safePrimary}aa;`,
    `background: linear-gradient(180deg, ${safePrimary}36, ${safeSecondary}2a);`,
    "color: #f5f5ff;"
  ].join(" ");
}

function applyRoleStyleToElement(element, roleStyle) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  const css = getRoleStyleCss(roleStyle);
  if (!css) {
    element.removeAttribute("style");
    return;
  }
  element.setAttribute("style", css);
}

function getRoleBadgeClass(role) {
  const normalized = normalizeRoleName(role);
  if (normalized === "owner") {
    return "role-owner";
  }
  if (normalized === "admin") {
    return "role-admin";
  }
  if (normalized === "moderator") {
    return "role-moderator";
  }
  return "role-user";
}

function getDisplayName(user) {
  if (!user) {
    return "-";
  }
  return String(user.fullName || user.nickname || user.username || "-");
}

function getInitials(user) {
  const source = String(user?.nickname || user?.username || "U")
    .trim()
    .replace(/\s+/g, "");
  return source.slice(0, 2).toUpperCase() || "U";
}

function setProfileAvatar(user) {
  if (!ui.profilePageAvatar) {
    return;
  }

  ui.profilePageAvatar.innerHTML = "";
  const avatarDataUrl = String(user?.avatarDataUrl || "").trim();
  if (avatarDataUrl) {
    const image = document.createElement("img");
    image.src = avatarDataUrl;
    image.alt = `${getDisplayName(user)} avatar`;
    ui.profilePageAvatar.appendChild(image);
    return;
  }

  ui.profilePageAvatar.textContent = getInitials(user);
}

function getPresenceText(user) {
  if (user?.isOnline === true) {
    return "в сети";
  }
  if (user?.isOnline === false) {
    return "offline";
  }
  return "offline";
}

function applyProfileViewMode(isOwn, user) {
  profileIsOwnView = Boolean(isOwn);
  profileViewedUser = user || null;

  if (ui.profileEditCard) {
    ui.profileEditCard.hidden = !profileIsOwnView;
  }
  if (ui.profileCommentForm) {
    ui.profileCommentForm.hidden = !profileIsOwnView;
  }
  if (ui.profileLogoutBtn) {
    ui.profileLogoutBtn.hidden = !profileIsOwnView;
  }
  if (ui.profileBackToSelfBtn) {
    ui.profileBackToSelfBtn.hidden = profileIsOwnView || !currentUser;
  }
  if (ui.profileViewHint) {
    if (profileIsOwnView) {
      ui.profileViewHint.textContent = "Это ваш профиль.";
    } else if (user?.username) {
      ui.profileViewHint.textContent = `Просмотр профиля @${user.username}.`;
    } else {
      ui.profileViewHint.textContent = "";
    }
  }
}

function renderProfileComments(comments = []) {
  if (!ui.profileCommentList) {
    return;
  }

  if (!Array.isArray(comments) || comments.length === 0) {
    ui.profileCommentList.innerHTML = "<li><p>Комментариев пока нет.</p></li>";
    return;
  }

  ui.profileCommentList.innerHTML = comments
    .map((comment) => `
      <li class="profile-comment-item">
        <div>
          <p>${escapeHtml(comment.text)}</p>
          <p class="profile-comments-meta">${escapeHtml(comment.author_name || "User")} • ${formatIsoDate(comment.created_at)}</p>
        </div>
        ${profileCanDeleteComments ? `<button type="button" class="btn btn-outline profile-comment-delete" data-comment-delete="${escapeHtml(comment.id)}">Удалить</button>` : ""}
      </li>
    `)
    .join("");
}

function renderProfileCollections(collections = []) {
  if (!ui.profileCollections) {
    return;
  }

  if (!Array.isArray(collections) || collections.length === 0) {
    ui.profileCollections.innerHTML = "<p class=\"muted\">Коллекции пока недоступны.</p>";
    return;
  }

  ui.profileCollections.innerHTML = collections
    .map((collection) => `
      <article class="profile-collection-card">
        <h4>${escapeHtml(collection.title)}</h4>
        <p>${escapeHtml(collection.subtitle)}</p>
        <span class="profile-collection-stage">${escapeHtml(collection.stage)}</span>
      </article>
    `)
    .join("");
}

function renderPublicUsers(users = []) {
  if (!ui.publicUsersGrid) {
    return;
  }

  if (!Array.isArray(users) || users.length === 0) {
    ui.publicUsersGrid.innerHTML = "<p class=\"muted\">Пока нет пользователей для отображения.</p>";
    return;
  }

  ui.publicUsersGrid.innerHTML = users
    .map((user) => {
      const roleLabel = user.roleLabel || user.role || "User";
      const roleClass = getRoleBadgeClass(user.role);
      const roleStyle = getRoleStyleCss(user.roleStyle);
      return `
        <article class="public-user-card">
          <div class="public-user-head">
            <span class="public-user-name">${escapeHtml(user.nickname || user.username || "user")}</span>
            <span class="profile-role-pill ${roleClass}" ${roleStyle ? `style="${escapeHtml(roleStyle)}"` : ""}>${escapeHtml(roleLabel)}</span>
          </div>
          <p class="public-user-meta">@${escapeHtml(user.username || "-")} • ${formatIsoDate(user.createdAt)}</p>
          <a class="btn btn-outline btn-wide" href="/u/${encodeURIComponent(user.username || "")}">Открыть профиль</a>
        </article>
      `;
    })
    .join("");
}

function fillProfileForm(user) {
  if (!ui.profileEditForm || !user) {
    return;
  }

  if (ui.profileEditUsername) {
    ui.profileEditUsername.value = String(user.username || "");
  }
  if (ui.profileEditNickname) {
    ui.profileEditNickname.value = String(user.nickname || user.username || "");
  }
  if (ui.profileEditFullName) {
    ui.profileEditFullName.value = String(user.fullName || "");
  }
  if (ui.profileEditBio) {
    ui.profileEditBio.value = String(user.bio || "");
  }
  if (ui.profileEditShowEmail) {
    ui.profileEditShowEmail.checked = Boolean(user.showEmail);
  }
  if (ui.profileEditPrivate) {
    ui.profileEditPrivate.checked = Boolean(user.profilePrivate);
  }
  if (ui.profileEditTheme) {
    ui.profileEditTheme.value = normalizeThemePreset(user.themePreset);
  }
  if (ui.profileAvatarRemove) {
    ui.profileAvatarRemove.checked = false;
  }
  if (ui.profileAvatarFileInput) {
    ui.profileAvatarFileInput.value = "";
  }
  pendingProfileAvatarDataUrl = null;
}

function renderProfilePage(payload) {
  if (!ui.profilePageRoot || !payload?.user) {
    return;
  }

  const { user, comments, collections } = payload;
  const hasViewer = Boolean(payload?.viewer);
  if (hasViewer) {
    currentUser = payload.viewer;
  }

  const ownProfile = Boolean(payload.isSelf ?? (currentUser && Number(currentUser.id) === Number(user.id)));
  const roleOnlyMode = !ownProfile && String(payload.profileVisibility || "full") === "role_only";
  const canShowEmail = Boolean(payload.emailVisible ?? ownProfile);
  profileCanDeleteComments = !roleOnlyMode && Boolean(payload.canDeleteComments ?? ownProfile);
  applyAuthButtonState();
  applyAdminButtonState();
  applyMessagesButtonState();
  applyProfileViewMode(ownProfile, user);

  if (ui.profileCommentsCard) {
    ui.profileCommentsCard.hidden = roleOnlyMode;
  }
  if (ui.profileCollectionsCard) {
    ui.profileCollectionsCard.hidden = roleOnlyMode;
  }

  if (ui.profilePageUsername) {
    ui.profilePageUsername.textContent = roleOnlyMode ? "@private" : `@${user.username || "-"}`;
  }
  if (ui.profilePageEmail) {
    ui.profilePageEmail.textContent = canShowEmail ? (user.email || currentUser?.email || "-") : "Скрыт";
  }
  if (ui.profilePageRole) {
    ui.profilePageRole.textContent = user.roleLabel || user.role || "-";
  }
  if (ui.profilePageId) {
    ui.profilePageId.textContent = roleOnlyMode ? "Приватно" : String(user.id || "-");
  }
  if (ui.profilePageDisplayName) {
    ui.profilePageDisplayName.textContent = roleOnlyMode ? "Приватный профиль" : getDisplayName(user);
  }
  if (ui.profilePageKicker) {
    ui.profilePageKicker.textContent = ownProfile ? "My Profile" : (roleOnlyMode ? "Private Profile" : "Public Profile");
  }
  if (ui.profilePageRolePill) {
    ui.profilePageRolePill.className = `profile-role-pill ${getRoleBadgeClass(user.role)}`;
    ui.profilePageRolePill.textContent = user.roleLabel || user.role || "User";
    applyRoleStyleToElement(ui.profilePageRolePill, user.roleStyle);
  }
  if (ui.profilePagePresence) {
    const presenceText = roleOnlyMode ? "скрыт" : getPresenceText(user);
    ui.profilePagePresence.textContent = presenceText;
    ui.profilePagePresence.classList.toggle("is-online", presenceText === "в сети");
  }
  if (ui.profilePageBio) {
    ui.profilePageBio.textContent = roleOnlyMode
      ? "Этот профиль приватный. Доступна только информация о роли."
      : (user.bio || "Описание профиля пока не добавлено.");
  }
  if (ui.profilePageCreatedAt) {
    ui.profilePageCreatedAt.textContent = roleOnlyMode ? "Приватно" : formatIsoDate(user.createdAt);
  }
  if (ui.profilePageLastActive) {
    ui.profilePageLastActive.textContent = roleOnlyMode ? "Приватно" : formatIsoDate(user.lastActiveAt);
  }
  if (ui.profileStatComments) {
    const commentsTotal = Number(user.stats?.commentsTotal);
    ui.profileStatComments.textContent = roleOnlyMode
      ? "-"
      : String(Number.isFinite(commentsTotal) ? commentsTotal : (Array.isArray(comments) ? comments.length : 0));
  }
  if (ui.profileStatDays) {
    ui.profileStatDays.textContent = roleOnlyMode ? "-" : String(user.stats?.daysOnSite ?? "-");
  }
  if (ui.profileStatActivity) {
    ui.profileStatActivity.textContent = roleOnlyMode ? "-" : String(user.stats?.activityTotal ?? "-");
  }

  if (roleOnlyMode) {
    setProfileAvatar({ nickname: "?", username: "?" });
  } else {
    setProfileAvatar(user);
  }

  if (ownProfile) {
    fillProfileForm(currentUser || user);
  }
  renderProfileComments(comments);
  renderProfileCollections(collections);
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
  document.title = isAdminPage()
    ? pickLocalized(ADMIN_TITLE_TEXT, "KimpintyaoVisual | Admin")
    : isMembersPage()
      ? pickLocalized(MEMBERS_TITLE_TEXT, "KimpintyaoVisual | Members")
      : isNewsPage()
        ? pickLocalized(NEWS_TITLE_TEXT, "KimpintyaoVisual | News")
        : isMessagesPage()
          ? pickLocalized(MESSAGES_TITLE_TEXT, "KimpintyaoVisual | Messages")
    : isAnyProfilePage()
      ? pickLocalized(PROFILE_TITLE_TEXT, "KimpintyaoVisual | Profile")
      : (isAuthPage() ? t("meta.authTitle") : t("meta.mainTitle"));

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

  applyAuthButtonState();
  applyAdminButtonState();
  applyMessagesButtonState();
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

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error("Файл не выбран."));
      return;
    }
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
      reject(new Error("Допустимы только изображения: jpg, png, webp, gif."));
      return;
    }
    if (file.size > 1_100_000) {
      reject(new Error("Файл слишком большой. Максимум ~1 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
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
  currentUser = user || null;
  applyAuthButtonState();
  applyAdminButtonState();
  applyMessagesButtonState();

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

function bindProfileHandlers() {
  if (ui.profileLookupForm) {
    ui.profileLookupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = String(ui.profileLookupInput?.value || "")
        .trim()
        .toLowerCase();

      if (!username) {
        await loadPublicUsersDirectory();
        return;
      }

      window.location.href = `/u/${encodeURIComponent(username)}`;
    });
  }

  if (ui.profileAvatarFileInput) {
    ui.profileAvatarFileInput.addEventListener("change", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.files || !target.files.length) {
        pendingProfileAvatarDataUrl = null;
        return;
      }
      const file = target.files[0];
      try {
        pendingProfileAvatarDataUrl = await readImageFileAsDataUrl(file);
        if (ui.profileAvatarRemove) {
          ui.profileAvatarRemove.checked = false;
        }
        setStatus("Аватар загружен. Нажми «Сохранить профиль».", false);
      } catch (error) {
        pendingProfileAvatarDataUrl = null;
        target.value = "";
        setStatus(error.message, true);
      }
    });
  }

  if (ui.profileAvatarRemove) {
    ui.profileAvatarRemove.addEventListener("change", () => {
      if (!ui.profileAvatarRemove.checked) {
        return;
      }
      pendingProfileAvatarDataUrl = null;
      if (ui.profileAvatarFileInput) {
        ui.profileAvatarFileInput.value = "";
      }
    });
  }

  if (ui.profileEditForm) {
    ui.profileEditForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!profileIsOwnView) {
        return;
      }

      const payload = {
        username: String(ui.profileEditUsername?.value || ""),
        nickname: String(ui.profileEditNickname?.value || ""),
        fullName: String(ui.profileEditFullName?.value || ""),
        bio: String(ui.profileEditBio?.value || ""),
        showEmail: Boolean(ui.profileEditShowEmail?.checked),
        profilePrivate: Boolean(ui.profileEditPrivate?.checked),
        themePreset: normalizeThemePreset(ui.profileEditTheme?.value),
        avatarRemove: Boolean(ui.profileAvatarRemove?.checked)
      };
      if (typeof pendingProfileAvatarDataUrl === "string" && pendingProfileAvatarDataUrl) {
        payload.avatarDataUrl = pendingProfileAvatarDataUrl;
      }

      try {
        await api("/api/profile", {
          method: "PUT",
          body: payload
        });
        await loadProfilePageData();
        if (currentUser?.themePreset) {
          applyThemePreset(currentUser.themePreset);
        }
        setStatus(pickLocalized(PROFILE_STATUS_TEXT.saved, "Profile saved."));
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.profileCommentForm) {
    ui.profileCommentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!profileIsOwnView) {
        return;
      }
      const text = String(ui.profileCommentInput?.value || "").trim();
      if (!text) {
        return;
      }

      try {
        const result = await api("/api/profile/comments", {
          method: "POST",
          body: { text }
        });
        renderProfileComments(result.comments || []);
        if (ui.profileCommentInput) {
          ui.profileCommentInput.value = "";
        }
        if (ui.profileStatComments) {
          ui.profileStatComments.textContent = String((result.comments || []).length);
        }
        setStatus(pickLocalized(PROFILE_STATUS_TEXT.commentAdded, "Comment added."));
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.profileCommentList) {
    ui.profileCommentList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const commentId = target.getAttribute("data-comment-delete");
      if (!commentId || !profileCanDeleteComments) {
        return;
      }

      const profileUsername = profileViewedUser?.username || currentUser?.username;
      if (!profileUsername) {
        return;
      }

      if (!window.confirm("Удалить этот комментарий?")) {
        return;
      }

      try {
        const result = await api(`/api/users/${encodeURIComponent(profileUsername)}/comments/${encodeURIComponent(commentId)}`, {
          method: "DELETE"
        });
        profileCanDeleteComments = Boolean(result.canDeleteComments ?? profileCanDeleteComments);
        renderProfileComments(result.comments || []);
        if (ui.profileStatComments) {
          ui.profileStatComments.textContent = String((result.comments || []).length);
        }
        setStatus("Комментарий удалён.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.profileLogoutBtn) {
    ui.profileLogoutBtn.addEventListener("click", async () => {
      try {
        await api("/api/auth/logout", { method: "POST" });
        currentUser = null;
        applyAuthButtonState();
        applyAdminButtonState();
        applyMessagesButtonState();
        window.location.href = "/auth";
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }
}

async function loadPublicUsersDirectory(query = "") {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();
  const querySuffix = normalizedQuery ? `&q=${encodeURIComponent(normalizedQuery)}` : "";

  try {
    const response = await api(`/api/users/public?limit=18${querySuffix}`);
    renderPublicUsers(response.users || []);
  } catch (error) {
    if (ui.publicUsersGrid) {
      ui.publicUsersGrid.innerHTML = "<p class=\"muted\">Не удалось загрузить пользователей.</p>";
    }
  }
}

async function loadProfilePageData() {
  if (isPublicProfilePage()) {
    const slug = getPublicProfileSlug();
    if (!slug) {
      throw new Error("Некорректная ссылка профиля.");
    }
    const profileData = await api(`/api/users/${encodeURIComponent(slug)}/profile`);
    renderProfilePage(profileData);
  } else {
    const profileData = await api("/api/profile");
    renderProfilePage({
      ...profileData,
      isSelf: true,
      viewer: profileData.user
    });
  }
  if (currentUser?.themePreset) {
    applyThemePreset(currentUser.themePreset);
  }
  await loadPublicUsersDirectory();
  setStatus(pickLocalized(PROFILE_STATUS_TEXT.loaded, "Profile loaded."));
}

function renderMembersCounts(totals = null) {
  if (!totals) {
    return;
  }

  if (ui.membersCreatorsCount) {
    ui.membersCreatorsCount.textContent = String(totals.creators ?? 0);
  }
  if (ui.membersAdminsCount) {
    ui.membersAdminsCount.textContent = String(totals.admins ?? 0);
  }
  if (ui.membersModeratorsCount) {
    ui.membersModeratorsCount.textContent = String(totals.moderators ?? 0);
  }
  if (ui.membersUsersCount) {
    ui.membersUsersCount.textContent = String(totals.users ?? 0);
  }
}

function renderMembersCards(users = []) {
  if (!ui.membersGrid) {
    return;
  }

  if (!Array.isArray(users) || users.length === 0) {
    ui.membersGrid.innerHTML = "<p class=\"members-empty\">В этой вкладке пока нет пользователей.</p>";
    return;
  }

  ui.membersGrid.innerHTML = users
    .map((user) => {
      const roleClass = getRoleBadgeClass(user.role);
      const roleStyle = getRoleStyleCss(user.roleStyle);
      const displayName = user.nickname || user.username || "User";
      const lastActiveText = user.lastActiveAt ? formatIsoDate(user.lastActiveAt) : formatIsoDate(user.createdAt);
      return `
        <article class="member-card">
          <div class="member-card-head">
            <strong>${escapeHtml(displayName)}</strong>
            <span class="profile-role-pill ${roleClass}" ${roleStyle ? `style="${escapeHtml(roleStyle)}"` : ""}>${escapeHtml(user.roleLabel || user.role || "User")}</span>
          </div>
          <p class="member-card-meta">@${escapeHtml(user.username || "-")}</p>
          <p class="member-card-meta">Активность: ${escapeHtml(lastActiveText)}</p>
          <p class="member-card-meta">Комментариев: ${escapeHtml(user.commentsCount ?? 0)}</p>
          <div class="member-card-actions">
            <a class="btn btn-outline btn-wide" href="/u/${encodeURIComponent(user.username || "")}">Открыть профиль</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderMembersActiveTab() {
  if (!ui.membersTabs || !membersCache?.groups) {
    return;
  }

  const allowedTabs = ["creators", "admins", "moderators", "users"];
  if (!allowedTabs.includes(membersActiveTab)) {
    membersActiveTab = "creators";
  }

  ui.membersTabs.querySelectorAll("[data-members-tab]").forEach((node) => {
    const tabName = node.getAttribute("data-members-tab");
    const isActive = tabName === membersActiveTab;
    node.classList.toggle("active", isActive);
    node.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  renderMembersCards(membersCache.groups[membersActiveTab] || []);
}

function renderMembersPage(payload) {
  if (!payload || !payload.groups) {
    return;
  }

  membersCache = payload;
  renderMembersCounts(payload.totals || null);
  renderMembersActiveTab();
}

async function loadMembersPageData(silent = false) {
  const payload = await api("/api/users/roles");
  renderMembersPage(payload);
  if (!silent) {
    setStatus(pickLocalized(MEMBERS_STATUS_TEXT.loaded, "Members page updated."));
  }
}

function bindMembersHandlers() {
  if (!ui.membersTabs) {
    return;
  }

  ui.membersTabs.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const tabName = target.getAttribute("data-members-tab");
    if (!tabName) {
      return;
    }

    membersActiveTab = tabName;
    renderMembersActiveTab();
  });
}

function startMembersAutoRefresh() {
  if (membersAutoRefreshTimer) {
    window.clearInterval(membersAutoRefreshTimer);
  }

  membersAutoRefreshTimer = window.setInterval(async () => {
    if (!isMembersPage()) {
      return;
    }

    try {
      await loadMembersPageData(true);
    } catch (error) {
      // silent background update
    }
  }, 12000);
}

function renderNewsPublishAccess() {
  if (!ui.newsPublishCard) {
    return;
  }
  const canPublish = canPublishNews(currentUser);
  ui.newsPublishCard.hidden = !canPublish;
  if (!canPublish) {
    setNewsEditMode(null);
  }
}

function renderNewsAudienceOptions(roles = []) {
  if (!(ui.newsTargetRolesInput instanceof HTMLSelectElement)) {
    return;
  }

  const roleOptions = Array.isArray(roles) ? roles : [];
  const previousSelection = Array.from(ui.newsTargetRolesInput.selectedOptions || []).map((option) => option.value);
  const selectedSet = new Set(previousSelection.length ? previousSelection : ["all"]);
  const optionsHtml = [
    `<option value="all" ${selectedSet.has("all") ? "selected" : ""}>Все пользователи</option>`,
    ...roleOptions.map((role) => {
      const name = String(role.name || "").trim().toLowerCase();
      const label = String(role.label || name || "role");
      if (!name || name === "all") {
        return "";
      }
      return `<option value="${escapeHtml(name)}" ${selectedSet.has(name) ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
  ].filter(Boolean).join("");

  ui.newsTargetRolesInput.innerHTML = optionsHtml;
}

function getSelectedNewsTargetRoles() {
  if (!(ui.newsTargetRolesInput instanceof HTMLSelectElement)) {
    return ["all"];
  }
  const selected = Array.from(ui.newsTargetRolesInput.selectedOptions || [])
    .map((option) => String(option.value || "").trim().toLowerCase())
    .filter(Boolean);
  if (!selected.length || selected.includes("all")) {
    return ["all"];
  }
  return Array.from(new Set(selected));
}

function setNewsEditMode(item = null) {
  newsEditingId = Number(item?.id) || 0;
  if (ui.newsEditId) {
    ui.newsEditId.value = newsEditingId > 0 ? String(newsEditingId) : "";
  }
  if (ui.newsSubmitBtn) {
    ui.newsSubmitBtn.textContent = newsEditingId > 0 ? "Сохранить изменения" : "Отправить новость";
  }
  if (ui.newsCancelEditBtn) {
    ui.newsCancelEditBtn.hidden = !(newsEditingId > 0);
  }

  if (newsEditingId > 0 && item) {
    if (ui.newsTitleInput) {
      ui.newsTitleInput.value = String(item.title || "");
    }
    if (ui.newsTextInput) {
      ui.newsTextInput.value = String(item.text || "");
    }
    if (ui.newsResendEmailInput) {
      ui.newsResendEmailInput.checked = false;
    }
    if (ui.newsTargetRolesInput) {
      const targetRoles = Array.isArray(item.target_roles) && item.target_roles.length ? item.target_roles : ["all"];
      Array.from(ui.newsTargetRolesInput.options).forEach((option) => {
        option.selected = targetRoles.includes(String(option.value || "").toLowerCase());
      });
    }
    return;
  }

  if (ui.newsCreateForm) {
    ui.newsCreateForm.reset();
  }
  if (ui.newsTargetRolesInput) {
    Array.from(ui.newsTargetRolesInput.options).forEach((option) => {
      option.selected = String(option.value || "").toLowerCase() === "all";
    });
  }
}

async function loadNewsAudienceRoles() {
  try {
    const response = await api("/api/roles/public");
    newsAudienceRolesCache = Array.isArray(response.roles) ? response.roles : [];
    renderNewsAudienceOptions(newsAudienceRolesCache);
  } catch (error) {
    newsAudienceRolesCache = [];
    renderNewsAudienceOptions([]);
  }
}

function renderNewsList(news = []) {
  if (!ui.newsList) {
    return;
  }

  newsCache = Array.isArray(news) ? news : [];
  if (newsCache.length === 0) {
    ui.newsList.innerHTML = "<p class=\"muted\">Новостей пока нет.</p>";
    return;
  }

  ui.newsList.innerHTML = newsCache
    .map((item) => {
      const bodyHtml = escapeHtml(item.text || "").replace(/\n/g, "<br>");
      const delivery = item.email_delivery
        ? `Email: ${Number(item.email_delivery.sent || 0)} отправлено, ${Number(item.email_delivery.failed || 0)} ошибок`
        : "";
      const targetRoles = Array.isArray(item.target_roles) && item.target_roles.length ? item.target_roles : ["all"];
      const audienceLabel = targetRoles.includes("all")
        ? "Аудитория: все"
        : `Аудитория: ${targetRoles.join(", ")}`;
      const canManage = Boolean(item.can_manage) && canPublishNews(currentUser);
      const roleMeta = `${escapeHtml(item.author_role || "user")}${item.updated_at ? ` • обновлено ${escapeHtml(formatIsoDate(item.updated_at))}` : ""}`;

      return `
        <article class="news-card" id="news-${escapeHtml(item.id)}">
          <header class="news-card-head">
            <h4>${escapeHtml(item.title || "Новость")}</h4>
            <span>${escapeHtml(formatIsoDate(item.created_at))}</span>
          </header>
          <p class="news-card-meta">Автор: ${escapeHtml(item.author_username || "system")} (${roleMeta})</p>
          <p class="news-card-meta">${escapeHtml(audienceLabel)}</p>
          <p class="news-card-text">${bodyHtml}</p>
          ${delivery ? `<p class="news-card-meta">${escapeHtml(delivery)}</p>` : ""}
          ${canManage ? `
            <div class="news-card-actions">
              <button type="button" class="btn btn-outline" data-news-edit="${escapeHtml(item.id)}">Редактировать</button>
              <button type="button" class="btn btn-outline" data-news-delete="${escapeHtml(item.id)}">Удалить</button>
            </div>
          ` : ""}
        </article>
      `;
    })
    .join("");
}

async function loadNewsPageData(silent = false) {
  if (!newsAudienceRolesCache.length || !silent) {
    await loadNewsAudienceRoles();
  }
  const response = await api("/api/news?limit=120");
  renderNewsPublishAccess();
  renderNewsList(response.news || []);
  if (!silent) {
    setStatus(pickLocalized(NEWS_STATUS_TEXT.loaded, "News loaded."));
  }
}

function bindNewsHandlers() {
  if (!ui.newsCreateForm) {
    return;
  }

  if (ui.newsCancelEditBtn) {
    ui.newsCancelEditBtn.addEventListener("click", () => {
      setNewsEditMode(null);
    });
  }

  if (ui.newsTargetRolesInput) {
    ui.newsTargetRolesInput.addEventListener("change", () => {
      const selectedValues = getSelectedNewsTargetRoles();
      if (selectedValues.includes("all") && selectedValues.length > 1) {
        Array.from(ui.newsTargetRolesInput.options).forEach((option) => {
          option.selected = String(option.value || "").toLowerCase() !== "all";
        });
        return;
      }
      if (selectedValues.includes("all")) {
        Array.from(ui.newsTargetRolesInput.options).forEach((option) => {
          option.selected = String(option.value || "").toLowerCase() === "all";
        });
      }
    });
  }

  ui.newsCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canPublishNews(currentUser)) {
      setStatus("Только создатель или админ может публиковать новости.", true);
      return;
    }

    const title = String(ui.newsTitleInput?.value || "").trim();
    const text = String(ui.newsTextInput?.value || "").trim();
    const targetRoles = getSelectedNewsTargetRoles();
    const resendEmail = Boolean(ui.newsResendEmailInput?.checked);
    if (!title || !text) {
      setStatus("Заполни заголовок и текст новости.", true);
      return;
    }

    try {
      const requestPath = newsEditingId > 0
        ? `/api/news/${encodeURIComponent(newsEditingId)}`
        : "/api/news";
      const requestMethod = newsEditingId > 0 ? "PUT" : "POST";
      const result = await api(requestPath, {
        method: requestMethod,
        body: { title, text, targetRoles, resendEmail }
      });
      setNewsEditMode(null);
      await loadNewsPageData(true);
      const delivery = result.delivery || {};
      if (requestMethod === "PUT") {
        setStatus("Новость обновлена.");
      } else {
        setStatus(`${pickLocalized(NEWS_STATUS_TEXT.created, "News published and sent.")} Email: ${delivery.sent || 0}/${(delivery.sent || 0) + (delivery.failed || 0) + (delivery.skipped || 0)}.`);
      }
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  if (ui.newsList) {
    ui.newsList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const editId = Number(target.getAttribute("data-news-edit"));
      const deleteId = Number(target.getAttribute("data-news-delete"));

      if (Number.isFinite(editId) && editId > 0) {
        const found = newsCache.find((item) => Number(item.id) === editId);
        if (!found) {
          return;
        }
        setNewsEditMode(found);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!Number.isFinite(deleteId) || deleteId <= 0) {
        return;
      }
      if (!window.confirm("Удалить эту новость?")) {
        return;
      }

      try {
        await api(`/api/news/${encodeURIComponent(deleteId)}`, { method: "DELETE" });
        if (newsEditingId === deleteId) {
          setNewsEditMode(null);
        }
        await loadNewsPageData(true);
        setStatus("Новость удалена.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }
}

function startNewsAutoRefresh() {
  if (newsAutoRefreshTimer) {
    window.clearInterval(newsAutoRefreshTimer);
  }

  newsAutoRefreshTimer = window.setInterval(async () => {
    if (!isNewsPage()) {
      return;
    }

    try {
      await loadNewsPageData(true);
    } catch (error) {
      // silent background update
    }
  }, 15000);
}

function renderMessagesList(messages = []) {
  if (!ui.messagesList) {
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    ui.messagesList.innerHTML = "<p class=\"muted\">Сообщений пока нет.</p>";
    return;
  }

  ui.messagesList.innerHTML = messages
    .map((item) => {
      const textHtml = escapeHtml(item.text || "").replace(/\n/g, "<br>");
      const unreadClass = item.read_at ? "" : "unread";
      const newsHref = item.source_news_id ? `/news#news-${encodeURIComponent(item.source_news_id)}` : "/news";
      return `
        <article class="message-card ${unreadClass}">
          <header class="message-card-head">
            <h4>${escapeHtml(item.title || "Сообщение")}</h4>
            <span>${escapeHtml(formatIsoDate(item.created_at))}</span>
          </header>
          <p class="message-card-text">${textHtml}</p>
          <div class="message-card-actions">
            <a class="btn btn-outline" href="${newsHref}">К новости</a>
            ${item.read_at ? "<span class=\"message-read-chip\">Прочитано</span>" : `<button type="button" class="btn btn-outline" data-message-read="${escapeHtml(item.id)}">Прочитать</button>`}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderMessagesPage(payload) {
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const unread = Number(payload?.unread || 0);

  if (ui.messagesUnreadCount) {
    ui.messagesUnreadCount.textContent = String(unread);
  }
  if (ui.messagesTotalCount) {
    ui.messagesTotalCount.textContent = String(messages.length);
  }
  renderMessagesList(messages);
}

async function loadMessagesPageData(silent = false) {
  const payload = await api("/api/messages?limit=180");
  renderMessagesPage(payload);
  if (!silent) {
    setStatus(pickLocalized(MESSAGES_STATUS_TEXT.loaded, "Messages loaded."));
  }
}

function bindMessagesHandlers() {
  if (ui.messagesReadAllBtn) {
    ui.messagesReadAllBtn.addEventListener("click", async () => {
      try {
        await api("/api/messages/read-all", { method: "POST" });
        await loadMessagesPageData(true);
        setStatus("Все сообщения отмечены прочитанными.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.messagesList) {
    ui.messagesList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const messageId = target.getAttribute("data-message-read");
      if (!messageId) {
        return;
      }

      try {
        await api(`/api/messages/${encodeURIComponent(messageId)}/read`, { method: "POST" });
        await loadMessagesPageData(true);
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }
}

function startMessagesAutoRefresh() {
  if (messagesAutoRefreshTimer) {
    window.clearInterval(messagesAutoRefreshTimer);
  }

  messagesAutoRefreshTimer = window.setInterval(async () => {
    if (!isMessagesPage()) {
      return;
    }

    try {
      await loadMessagesPageData(true);
    } catch (error) {
      // silent background update
    }
  }, 12000);
}

function renderAdminStats(stats) {
  if (!stats) {
    return;
  }

  if (ui.adminStatUsers) {
    ui.adminStatUsers.textContent = String(stats.totalUsers ?? "-");
  }
  if (ui.adminStatAdmins) {
    ui.adminStatAdmins.textContent = String(stats.adminUsers ?? "-");
  }
  if (ui.adminStatNew7d) {
    ui.adminStatNew7d.textContent = String(stats.newUsers7d ?? "-");
  }
  if (ui.adminStatActive24h) {
    ui.adminStatActive24h.textContent = String(stats.active24h ?? "-");
  }
  if (ui.adminStatBanned) {
    ui.adminStatBanned.textContent = String(stats.bannedUsers ?? "-");
  }
  if (ui.adminStatComments) {
    ui.adminStatComments.textContent = String(stats.commentsTotal ?? "-");
  }
}

function renderAdminUsers(users) {
  if (!ui.adminUsersBody) {
    return;
  }

  adminUsersCache = Array.isArray(users) ? users : [];

  if (adminUsersCache.length === 0) {
    ui.adminUsersBody.innerHTML = "<tr><td colspan=\"9\">Пользователей нет.</td></tr>";
    return;
  }

  const roleOptions = adminRolesCache
    .map((role) => `<option value="${escapeHtml(role.name)}">${escapeHtml(role.label || role.name)}</option>`)
    .join("");

  ui.adminUsersBody.innerHTML = adminUsersCache
    .map((user) => {
      const role = String(user.role || "user");
      const roleLabel = String(user.roleLabel || role || "user");
      const roleStyle = getRoleStyleCss(user.roleStyle);
      const activeAt = user.lastActiveAt ? formatIsoDate(user.lastActiveAt) : formatIsoDate(user.createdAt);
      const isCurrent = currentUser && Number(currentUser.id) === Number(user.id);
      const isOwner = String(user.email || "").trim().toLowerCase() === CLIENT_OWNER_EMAIL || role === "owner";
      const isBanned = Boolean(user.isBanned);

      const selectedRoleControl = `
        <div class="admin-role-control">
          <select class="admin-role-select" data-role-select="${escapeHtml(user.id)}" ${isOwner ? "disabled" : ""}>
            ${roleOptions}
          </select>
          <button
            type="button"
            class="btn btn-outline"
            data-role-save="${escapeHtml(user.id)}"
            ${isOwner ? "disabled" : ""}
          >
            Роль
          </button>
        </div>
      `;

      const banLabel = isBanned
        ? `До ${formatIsoDate(user.bannedUntil)}${user.banReason ? ` • ${escapeHtml(user.banReason)}` : ""}`
        : "Нет";

      return `
        <tr>
          <td><strong>${escapeHtml(user.id)}</strong></td>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.username)}</td>
          <td>${escapeHtml(user.nickname || "-")}</td>
          <td><span class="profile-role-pill ${getRoleBadgeClass(role)}" ${roleStyle ? `style="${escapeHtml(roleStyle)}"` : ""}>${escapeHtml(roleLabel)}</span></td>
          <td>${escapeHtml(user.commentsCount ?? 0)}</td>
          <td>${escapeHtml(activeAt)}</td>
          <td><span class="admin-ban-chip ${isBanned ? "active" : ""}">${banLabel}</span></td>
          <td>
            ${selectedRoleControl}
            <div class="admin-user-actions">
              <button type="button" class="btn btn-outline" data-user-ban="${escapeHtml(user.id)}" ${isOwner ? "disabled" : ""}>Бан</button>
              <button type="button" class="btn btn-outline" data-user-unban="${escapeHtml(user.id)}" ${(!isBanned || isOwner) ? "disabled" : ""}>Разбан</button>
              <button type="button" class="btn btn-outline" data-user-delete="${escapeHtml(user.id)}" ${(isCurrent || isOwner) ? "disabled" : ""}>Удалить</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  adminUsersCache.forEach((user) => {
    const select = ui.adminUsersBody.querySelector(`[data-role-select="${user.id}"]`);
    if (select instanceof HTMLSelectElement) {
      select.value = String(user.role || "user");
    }
  });
}

function renderAdminRoles(roles) {
  if (!ui.adminRolesList) {
    return;
  }

  adminRolesCache = Array.isArray(roles) ? roles : [];
  if (adminRolesCache.length === 0) {
    ui.adminRolesList.innerHTML = "<li><p>Ролей нет.</p></li>";
    return;
  }

  ui.adminRolesList.innerHTML = adminRolesCache
    .map((role) => {
      const roleStyle = getRoleStyleCss({
        primary: role.color_primary,
        secondary: role.color_secondary
      });
      return `
      <li class="admin-role-item">
        <div class="admin-role-meta">
          <span class="admin-role-name">${escapeHtml(role.label || role.name)} (${escapeHtml(role.name)})</span>
          <span class="admin-role-perms">${escapeHtml((role.permissions || []).join(", ") || "без прав")}</span>
          <span class="profile-role-pill ${getRoleBadgeClass(role.name)}" ${roleStyle ? `style="${escapeHtml(roleStyle)}"` : ""}>Preview</span>
        </div>
        <button
          type="button"
          class="btn btn-outline"
          data-role-delete="${escapeHtml(role.name)}"
          ${role.system ? "disabled" : ""}
        >
          Удалить
        </button>
      </li>
    `;
    })
    .join("");
}

function renderAdminActivity(activity) {
  if (!ui.adminActivityBody) {
    return;
  }

  adminActivityCache = Array.isArray(activity) ? activity : [];
  if (adminActivityCache.length === 0) {
    ui.adminActivityBody.innerHTML = "<tr><td colspan=\"4\">Событий пока нет.</td></tr>";
    return;
  }

  ui.adminActivityBody.innerHTML = adminActivityCache
    .map((item) => {
      const actor = item.user_email || (item.user_id ? `user#${item.user_id}` : "system");
      const details = item.meta && Object.keys(item.meta).length
        ? escapeHtml(JSON.stringify(item.meta))
        : "-";

      return `
        <tr>
          <td>${escapeHtml(formatIsoDate(item.created_at))}</td>
          <td><strong>${escapeHtml(item.event)}</strong></td>
          <td>${escapeHtml(actor)}</td>
          <td>${details}</td>
        </tr>
      `;
    })
    .join("");
}

function parsePermissionsInput(raw) {
  return String(raw || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadAdminPageData() {
  const [overview, usersResponse, rolesResponse, activityResponse] = await Promise.all([
    api("/api/admin/overview"),
    api("/api/admin/users"),
    api("/api/admin/roles"),
    api("/api/admin/activity?limit=120")
  ]);

  renderAdminStats(overview.stats || null);
  renderAdminRoles(rolesResponse.roles || []);
  renderAdminUsers(usersResponse.users || []);
  renderAdminActivity(activityResponse.activity || []);
  setStatus(pickLocalized(ADMIN_STATUS_TEXT.loaded, "Admin panel loaded."));
}

function bindAdminHandlers() {
  if (ui.adminRefreshBtn) {
    ui.adminRefreshBtn.addEventListener("click", async () => {
      try {
        await loadAdminPageData();
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.adminLogoutBtn) {
    ui.adminLogoutBtn.addEventListener("click", async () => {
      try {
        await api("/api/auth/logout", { method: "POST" });
        currentUser = null;
        applyAuthButtonState();
        applyAdminButtonState();
        applyMessagesButtonState();
        window.location.href = "/auth";
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.adminUsersBody) {
    ui.adminUsersBody.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const userId = target.getAttribute("data-role-save");
      const deleteId = target.getAttribute("data-user-delete");
      const banId = target.getAttribute("data-user-ban");
      const unbanId = target.getAttribute("data-user-unban");

      try {
        if (userId) {
          const select = ui.adminUsersBody.querySelector(`[data-role-select="${userId}"]`);
          if (!(select instanceof HTMLSelectElement)) {
            return;
          }

          await api(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
            method: "PATCH",
            body: { role: select.value }
          });
          await loadAdminPageData();
          setStatus(pickLocalized(ADMIN_STATUS_TEXT.roleUpdated, "User role updated."));
          return;
        }

        if (deleteId) {
          if (!window.confirm("Удалить аккаунт пользователя? Действие необратимо.")) {
            return;
          }
          await api(`/api/admin/users/${encodeURIComponent(deleteId)}`, {
            method: "DELETE"
          });
          await loadAdminPageData();
          setStatus(pickLocalized(ADMIN_STATUS_TEXT.userDeleted, "Account deleted."));
          return;
        }

        if (banId) {
          const minutesRaw = window.prompt("Срок бана в минутах (1..43200):", "60");
          if (minutesRaw === null) {
            return;
          }
          const minutes = Number(minutesRaw);
          if (!Number.isFinite(minutes) || minutes <= 0) {
            setStatus("Некорректный срок бана.", true);
            return;
          }
          const reason = window.prompt("Причина бана (необязательно):", "") || "";
          await api(`/api/admin/users/${encodeURIComponent(banId)}/ban`, {
            method: "POST",
            body: { minutes, reason }
          });
          await loadAdminPageData();
          setStatus(pickLocalized(ADMIN_STATUS_TEXT.userBanned, "User banned."));
          return;
        }

        if (unbanId) {
          await api(`/api/admin/users/${encodeURIComponent(unbanId)}/unban`, {
            method: "POST"
          });
          await loadAdminPageData();
          setStatus(pickLocalized(ADMIN_STATUS_TEXT.userUnbanned, "Ban removed."));
        }
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.adminRoleCreateForm) {
    ui.adminRoleCreateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = String(ui.adminRoleNameInput?.value || "").trim();
      const label = String(ui.adminRoleLabelInput?.value || "").trim();
      const permissions = parsePermissionsInput(ui.adminRolePermissionsInput?.value || "");
      const colorPrimary = String(ui.adminRolePrimaryInput?.value || "").trim();
      const colorSecondary = String(ui.adminRoleSecondaryInput?.value || "").trim();

      try {
        await api("/api/admin/roles", {
          method: "POST",
          body: { name, label, permissions, colorPrimary, colorSecondary }
        });
        ui.adminRoleCreateForm.reset();
        if (ui.adminRolePrimaryInput) {
          ui.adminRolePrimaryInput.value = "#8f76ff";
        }
        if (ui.adminRoleSecondaryInput) {
          ui.adminRoleSecondaryInput.value = "#5740c7";
        }
        await loadAdminPageData();
        setStatus(pickLocalized(ADMIN_STATUS_TEXT.roleCreated, "Role created."));
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.adminRolesList) {
    ui.adminRolesList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const roleName = target.getAttribute("data-role-delete");
      if (!roleName) {
        return;
      }

      if (!window.confirm(`Удалить роль "${roleName}"?`)) {
        return;
      }

      try {
        await api(`/api/admin/roles/${encodeURIComponent(roleName)}`, {
          method: "DELETE"
        });
        await loadAdminPageData();
        setStatus(pickLocalized(ADMIN_STATUS_TEXT.roleDeleted, "Role deleted."));
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  if (ui.adminActivityRefreshBtn) {
    ui.adminActivityRefreshBtn.addEventListener("click", async () => {
      try {
        const response = await api("/api/admin/activity?limit=120");
        renderAdminActivity(response.activity || []);
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
  bindProfileHandlers();
  bindMembersHandlers();
  bindNewsHandlers();
  bindMessagesHandlers();
  bindAdminHandlers();

  try {
    const [config, me] = await Promise.all([api("/api/config"), api("/api/auth/me")]);

    if (config.version && ui.versionText) {
      ui.versionText.textContent = `v${config.version}`;
    }

    currentUser = me.authenticated ? me.user : null;
    applyThemePreset(currentUser?.themePreset || "violet");
    applyAuthButtonState();
    applyAdminButtonState();
    applyMessagesButtonState();

    if (isAuthPage()) {
      renderUser(currentUser);
    }

    if (isProfilePage()) {
      if (!me.authenticated) {
        window.location.href = "/auth";
        return;
      }
      await loadProfilePageData();
    }

    if (isPublicProfilePage()) {
      await loadProfilePageData();
    }

    if (isMembersPage()) {
      await loadMembersPageData();
      startMembersAutoRefresh();
    }

    if (isNewsPage()) {
      await loadNewsPageData();
      startNewsAutoRefresh();
    }

    if (isMessagesPage()) {
      if (!me.authenticated) {
        window.location.href = "/auth";
        return;
      }
      await loadMessagesPageData();
      startMessagesAutoRefresh();
    }

    if (isAdminPage()) {
      if (!me.authenticated) {
        window.location.href = "/auth";
        return;
      }
      const allowedAdmin = canAccessAdmin(me.user);
      if (!allowedAdmin) {
        window.location.href = "/profile";
        return;
      }
      await loadAdminPageData();
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

bootstrap();
