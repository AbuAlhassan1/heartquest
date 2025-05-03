export type Language = "en" | "ar"

export const translations = {
  en: {
    // General
    appName: "HeartQuest",
    tagline:
      "A turn-based adventure for two hearts, where strategy meets romance and every choice brings you closer together.",
    startNewGame: "Start New Game",
    howToPlay: "How To Play",
    backToHome: "Back to Home",
    loading: "Loading...",
    error: "Error",

    // Authentication
    register: "Register",
    login: "Login",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccount: "Create your account to start playing",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    welcomeBack: "Welcome back! Please log in to continue",
    loggingIn: "Logging in...",
    registering: "Registering...",
    logout: "Logout",

    // Dashboard
    dashboard: "Dashboard",
    loggedInAs: "Logged in as",
    myGames: "My Games",
    gamesYouCreatedOrJoined: "Games you've created or joined",
    availableGames: "Available Games",
    joinExistingGame: "Join an existing game",
    createNewGame: "Create New Game",
    noGamesYet: "You haven't created or joined any games yet",
    noAvailableGames: "No available games to join at the moment",
    gameWithId: "Game #{id}",
    waitingForPlayer: "Waiting for player to join",
    waitingForPlayerToJoin: "Waiting for another player to join",
    waitingForPlayerToSelect: "Waiting for player to select",
    waitingForHostToStart: "Waiting for host to start the game",
    inProgress: "In progress",
    completed: "Completed",
    host: "Host",
    guest: "Guest",
    hostedBy: "Hosted by {host}",
    createdAt: "Created {time}",
    join: "Join",
    backToDashboard: "Back to Dashboard",
    gameNotFound: "Game not found or no longer available",
    waitingForOpponent: "Waiting for opponent's move",

    // Game actions
    redoTurn: "Redo Turn",
    selected: "Selected",

    // Home page features
    strategicChallenges: "Strategic Challenges",
    strategicChallengesDesc: "Face puzzles and obstacles that require both wits and teamwork to overcome.",
    cooperativePlay: "Cooperative Play",
    cooperativePlayDesc: "Combine your unique character abilities to progress through the adventure together.",
    romanticJourney: "Romantic Journey",
    romanticJourneyDesc: "Discover intimate moments and build connection as you progress through your adventure.",

    // How to play
    howToPlayTitle: "How To Play HeartQuest",
    gameOverview: "Game Overview",
    gameOverviewDesc:
      "HeartQuest is a turn-based adventure game designed for two players. You'll embark on a journey together, facing challenges, solving puzzles, and growing closer as you progress through the story.",
    gettingStarted: "Getting Started",
    gettingStartedSteps: [
      "Choose your character classes - each with unique abilities",
      "Take turns moving on the game board",
      "Collect resources and items to help on your journey",
      "Face challenges together that test your strategy and teamwork",
    ],
    turnStructure: "Turn Structure",
    turnStructureDesc: "Each turn consists of three phases:",
    movementPhase: "Movement Phase",
    movementPhaseDesc: "Move your character on the board",
    actionPhase: "Action Phase",
    actionPhaseDesc: "Use abilities, items, or interact with the environment",
    connectionPhase: "Connection Phase",
    connectionPhaseDesc: "Choose a connection card to share with your partner",
    connectionCards: "Connection Cards",
    connectionCardsDesc:
      "Connection cards are special cards that build intimacy between players. They might ask you to share a memory, give a compliment, or perform a small gesture of affection. These cards provide bonuses to your characters while creating real moments of connection between you and your partner.",
    winningTogether: "Winning Together",
    winningTogetherDesc:
      "While there are competitive elements, HeartQuest is primarily a cooperative game. Your ultimate goal is to complete the journey together, overcoming obstacles and building your relationship along the way.",
    startYourAdventure: "Start Your Adventure",

    // Game page
    chooseYourCharacters: "Choose Your Characters",
    chooseYourCharacter: "Choose Your Character",
    startAdventure: "Start Adventure",
    playerTurn: "Player {number}'s Turn",
    connectionCard: "Connection Card",
    endTurn: "End Turn",
    players: "Players",
    gameLog: "Game Log",
    currentTurn: "Current Turn",
    position: "Position",
    health: "Health",
    energy: "Energy",
    items: "Items",
    rollDice: "Roll Dice",
    gameBoard: "Game Board",
    legend: "Legend",
    normalSpace: "Normal Space",
    challenge: "Challenge",
    reward: "Reward",
    abilities: "Abilities",

    // Connection cards
    connectionMoment: "Connection Moment",
    takeAMoment: "Take a moment to connect with your partner",
    complete: "Complete",

    // Character classes
    warrior: "Warrior",
    warriorDesc: "A brave fighter with exceptional strength and courage.",
    warriorAbilities: ["Powerful Strike", "Protective Stance", "Rally Courage"],

    guardian: "Guardian",
    guardianDesc: "A stalwart protector who shields allies from harm.",
    guardianAbilities: ["Shield Wall", "Inspiring Presence", "Steadfast Defense"],

    mage: "Mage",
    mageDesc: "A wielder of arcane powers and ancient knowledge.",
    mageAbilities: ["Arcane Bolt", "Mystic Shield", "Elemental Mastery"],

    empath: "Empath",
    empathDesc: "A compassionate soul with the power to heal and connect.",
    empathAbilities: ["Healing Touch", "Emotional Bond", "Soothing Presence"],

    trickster: "Trickster",
    tricksterDesc: "A clever and agile character who uses wit to overcome obstacles.",
    tricksterAbilities: ["Quick Thinking", "Misdirection", "Lucky Charm"],

    sage: "Sage",
    sageDesc: "A wise mentor with deep knowledge and strategic insight.",
    sageAbilities: ["Ancient Wisdom", "Strategic Planning", "Insightful Analysis"],

    // Stats
    strength: "Strength",
    defense: "Defense",
    magic: "Magic",
    charm: "Charm",

    // Game over
    journeyComplete: "Journey Complete!",
    congratulations:
      "Congratulations! You've completed your adventure together. Your bond has grown stronger through the challenges you've faced.",
    returnHome: "Return Home",

    // Connection cards
    sharedMemory: "Shared Memory",
    sharedMemoryDesc: "Share a favorite memory you have together.",
    sharedMemoryEffect: "Both players gain 10 energy.",

    gentleTouch: "Gentle Touch",
    gentleTouchDesc: "Hold hands for 10 seconds.",
    gentleTouchEffect: "Both players gain 15 health.",

    compliment: "Compliment",
    complimentDesc: "Give your partner a genuine compliment.",
    complimentEffect: "Active player gains a bonus action.",

    futureDreams: "Future Dreams",
    futureDreamsDesc: "Share something you're looking forward to doing together.",
    futureDreamsEffect: "Both players gain a special item.",

    sweetGesture: "Sweet Gesture",
    sweetGestureDesc: "Give your partner a small kiss.",
    sweetGestureEffect: "Both players fully restore their energy.",

    // Game log messages
    welcomeMessage: "Welcome to HeartQuest! Choose your characters to begin your journey.",
    adventureBegins: "The adventure begins! Player 1 goes first.",
    bothPlayersSelect: "Both players must select a character before starting.",
    playerSelectedCharacter: "{player} selected the {character}.",
    nowPlayerTurn: "It's now Player {number}'s turn.",
    playerMoved: "Player {number} moved {steps} spaces.",
    congratsCompleted: "Congratulations! You've completed your journey together!",
    sharedMemoryLog: "Both players shared a memory and gained 10 energy.",
    gentleTouchLog: "Players held hands and gained 15 health.",
    complimentLog: "A compliment was shared. The active player gained a bonus action.",
    futureDreamsLog: "Players shared future dreams and each received a Dream Crystal.",
    sweetGestureLog: "A sweet gesture restored all energy for both players.",

    // Special spaces
    puzzleChallenge: "Puzzle Challenge",
    treasureChest: "Treasure Chest",
    monsterEncounter: "Monster Encounter",
    healingSpring: "Healing Spring",
    finalBoss: "Final Boss",

    // Language
    language: "Language",
    english: "English",
    arabic: "العربية",
    selectedBy: "Selected by {player}",
  },
  ar: {
    // General
    appName: "رحلة القلب",
    tagline: "مغامرة تبادلية لقلبين، حيث تلتقي الإستراتيجية بالرومانسية وكل اختيار يقربكما أكثر.",
    startNewGame: "بدء لعبة جديدة",
    howToPlay: "كيفية اللعب",
    backToHome: "العودة إلى الصفحة الرئيسية",
    loading: "جاري التحميل...",
    error: "خطأ",

    // Authentication
    register: "تسجيل",
    login: "تسجيل الدخول",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    createAccount: "أنشئ حسابك لبدء اللعب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    welcomeBack: "مرحبًا بعودتك! الرجاء تسجيل الدخول للمتابعة",
    loggingIn: "جاري تسجيل الدخول...",
    registering: "جاري التسجيل...",
    logout: "تسجيل الخروج",

    // Dashboard
    dashboard: "لوحة التحكم",
    loggedInAs: "تم تسجيل الدخول باسم",
    myGames: "ألعابي",
    gamesYouCreatedOrJoined: "الألعاب التي أنشأتها أو انضممت إليها",
    availableGames: "الألعاب المتاحة",
    joinExistingGame: "انضم إلى لعبة موجودة",
    createNewGame: "إنشاء لعبة جديدة",
    noGamesYet: "لم تقم بإنشاء أو الانضمام إلى أي ألعاب حتى الآن",
    noAvailableGames: "لا توجد ألعاب متاحة للانضمام في الوقت الحالي",
    gameWithId: "لعبة #{id}",
    waitingForPlayer: "في انتظار انضمام لاعب",
    waitingForPlayerToJoin: "في انتظار انضمام لاعب آخر",
    waitingForPlayerToSelect: "في انتظار اختيار اللاعب",
    waitingForHostToStart: "في انتظار المضيف لبدء اللعبة",
    inProgress: "قيد التقدم",
    completed: "مكتملة",
    host: "مضيف",
    guest: "ضيف",
    hostedBy: "استضافها {host}",
    createdAt: "أنشئت {time}",
    join: "انضم",
    backToDashboard: "العودة إلى لوحة التحكم",
    gameNotFound: "اللعبة غير موجودة أو لم تعد متاحة",
    waitingForOpponent: "في انتظار حركة الخصم",

    // Game actions
    redoTurn: "إعادة الدور",
    selected: "محدد",

    // Home page features
    strategicChallenges: "تحديات استراتيجية",
    strategicChallengesDesc: "واجه الألغاز والعقبات التي تتطلب الذكاء والعمل الجماعي للتغلب عليها.",
    cooperativePlay: "لعب تعاوني",
    cooperativePlayDesc: "اجمع بين قدرات شخصياتكما الفريدة للتقدم في المغامرة معًا.",
    romanticJourney: "رحلة رومانسية",
    romanticJourneyDesc: "اكتشف لحظات حميمة وابنِ التواصل أثناء تقدمك في مغامرتك.",

    // How to play
    howToPlayTitle: "كيفية لعب رحلة القلب",
    gameOverview: "نظرة عامة على اللعبة",
    gameOverviewDesc:
      "رحلة القلب هي لعبة مغامرة تبادلية مصممة للاعبين اثنين. ستنطلقان في رحلة معًا، وتواجهان التحديات، وتحلان الألغاز، وتزداد قربًا أثناء تقدمكما في القصة.",
    gettingStarted: "البدء",
    gettingStartedSteps: [
      "اختر فئات الشخصيات - كل منها بقدرات فريدة",
      "تناوبا الأدوار في التحرك على لوحة اللعبة",
      "اجمع الموارد والعناصر للمساعدة في رحلتك",
      "واجها التحديات معًا التي تختبر استراتيجيتكما وعملكما الجماعي",
    ],
    turnStructure: "هيكل الدور",
    turnStructureDesc: "يتكون كل دور من ثلاث مراحل:",
    movementPhase: "مرحلة الحركة",
    movementPhaseDesc: "حرك شخصيتك على اللوحة",
    actionPhase: "مرحلة الفعل",
    actionPhaseDesc: "استخدم القدرات أو العناصر أو تفاعل مع البيئة",
    connectionPhase: "مرحلة التواصل",
    connectionPhaseDesc: "اختر بطاقة تواصل لمشاركتها مع شريكك",
    connectionCards: "بطاقات التواصل",
    connectionCardsDesc:
      "بطاقات التواصل هي بطاقات خاصة تبني الألفة بين اللاعبين. قد تطلب منك مشاركة ذكرى، أو تقديم مجاملة، أو أداء لفتة صغيرة من المودة. توفر هذه البطاقات مكافآت لشخصياتك مع خلق لحظات حقيقية من التواصل بينك وبين شريكك.",
    winningTogether: "الفوز معًا",
    winningTogetherDesc:
      "على الرغم من وجود عناصر تنافسية، إلا أن رحلة القلب هي في الأساس لعبة تعاونية. هدفك النهائي هو إكمال الرحلة معًا، والتغلب على العقبات وبناء علاقتكما على طول الطريق.",
    startYourAdventure: "ابدأ مغامرتك",

    // Game page
    chooseYourCharacters: "اختر شخصياتك",
    chooseYourCharacter: "اختر شخصيتك",
    startAdventure: "بدء المغامرة",
    playerTurn: "دور اللاعب {number}",
    connectionCard: "بطاقة تواصل",
    endTurn: "إنهاء الدور",
    players: "اللاعبون",
    gameLog: "سجل اللعبة",
    currentTurn: "الدور الحالي",
    position: "الموقع",
    health: "الصحة",
    energy: "الطاقة",
    items: "العناصر",
    rollDice: "رمي النرد",
    gameBoard: "لوحة اللعبة",
    legend: "المفتاح",
    normalSpace: "مربع عادي",
    challenge: "تحدي",
    reward: "مكافأة",
    abilities: "القدرات",

    // Connection cards
    connectionMoment: "لحظة تواصل",
    takeAMoment: "خذ لحظة للتواصل مع شريكك",
    complete: "إكمال",

    // Character classes
    warrior: "المحارب",
    warriorDesc: "مقاتل شجاع يتمتع بقوة واستثنائية وشجاعة.",
    warriorAbilities: ["ضربة قوية", "وقفة حماية", "حشد الشجاعة"],

    guardian: "الحارس",
    guardianDesc: "حامٍ ثابت يحمي الحلفاء من الأذى.",
    guardianAbilities: ["جدار الدرع", "حضور ملهم", "دفاع ثابت"],

    mage: "الساحر",
    mageDesc: "مستخدم للقوى السحرية والمعرفة القديمة.",
    mageAbilities: ["سهم سحري", "درع غامض", "إتقان العناصر"],

    empath: "المتعاطف",
    empathDesc: "روح رحيمة تمتلك القدرة على الشفاء والتواصل.",
    empathAbilities: ["لمسة الشفاء", "رابطة عاطفية", "حضور مهدئ"],

    trickster: "المخادع",
    tricksterDesc: "شخصية ذكية ورشيقة تستخدم الذكاء للتغلب على العقبات.",
    tricksterAbilities: ["تفكير سريع", "تضليل", "تميمة الحظ"],

    sage: "الحكيم",
    sageDesc: "مرشد حكيم ذو معرفة عميقة وبصيرة استراتيجية.",
    sageAbilities: ["حكمة قديمة", "تخطيط استراتيجي", "تحليل بصير"],

    // Stats
    strength: "القوة",
    defense: "الدفاع",
    magic: "السحر",
    charm: "السحر الشخصي",

    // Game over
    journeyComplete: "اكتملت الرحلة!",
    congratulations: "تهانينا! لقد أكملتما مغامرتكما معًا. أصبح رباطكما أقوى من خلال التحديات التي واجهتماها.",
    returnHome: "العودة إلى الصفحة الرئيسية",

    // Connection cards
    sharedMemory: "ذكرى مشتركة",
    sharedMemoryDesc: "شارك ذكرى مفضلة لديكما معًا.",
    sharedMemoryEffect: "يكسب كلا اللاعبين 10 نقاط طاقة.",

    gentleTouch: "لمسة لطيفة",
    gentleTouchDesc: "امسكا أيدي بعضكما لمدة 10 ثوانٍ.",
    gentleTouchEffect: "يكسب كلا اللاعبين 15 نقطة صحة.",

    compliment: "مجاملة",
    complimentDesc: "قدم لشريكك مجاملة صادقة.",
    complimentEffect: "يكسب اللاعب النشط إجراءً إضافيًا.",

    futureDreams: "أحلام المستقبل",
    futureDreamsDesc: "شارك شيئًا تتطلع إلى القيام به معًا.",
    futureDreamsEffect: "يحصل كلا اللاعبين على عنصر خاص.",

    sweetGesture: "لفتة حلوة",
    sweetGestureDesc: "قدم لشريكك قبلة صغيرة.",
    sweetGestureEffect: "يستعيد كلا اللاعبين طاقتهما بالكامل.",

    // Game log messages
    welcomeMessage: "مرحبًا بك في رحلة القلب! اختر شخصياتك لبدء رحلتك.",
    adventureBegins: "تبدأ المغامرة! دور اللاعب 1 أولاً.",
    bothPlayersSelect: "يجب على كلا اللاعبين اختيار شخصية قبل البدء.",
    playerSelectedCharacter: "اختار {player} شخصية {character}.",
    nowPlayerTurn: "حان الآن دور اللاعب {number}.",
    playerMoved: "تحرك اللاعب {number} {steps} خطوات.",
    congratsCompleted: "تهانينا! لقد أكملتما رحلتكما معًا!",
    sharedMemoryLog: "شارك كلا اللاعبين ذكرى وحصلا على 10 نقاط طاقة.",
    gentleTouchLog: "أمسك اللاعبان بأيدي بعضهما وحصلا على 15 نقطة صحة.",
    complimentLog: "تمت مشاركة مجاملة. حصل اللاعب النشط على إجراء إضافي.",
    futureDreamsLog: "شارك اللاعبان أحلام المستقبل وحصل كل منهما على بلورة الأحلام.",
    sweetGestureLog: "أعادت لفتة حلوة كل الطاقة لكلا اللاعبين.",

    // Special spaces
    puzzleChallenge: "تحدي الألغاز",
    treasureChest: "صندوق الكنز",
    monsterEncounter: "مواجهة وحش",
    healingSpring: "نبع الشفاء",
    finalBoss: "الزعيم النهائي",

    // Language
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    selectedBy: "تم اختياره بواسطة {player}",
  },
}

export type TranslationKey = keyof typeof translations.en
