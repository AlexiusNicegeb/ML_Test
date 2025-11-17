import { Instructions, SentenceGroup, Target } from "./types";

export const TASK_LABELS = {
  task1: "Task 1",
  task2: "Task 2",
  task3: "Task 3",
};

export const STATIC_TEXT = {
  task1: "Lies den Text aufmerksam durch und markiere wichtige Stellen.",
  task2: "Beantworte die folgenden Fragen zum Textinhalt.",
  task3: "Fasse den Text in deinen eigenen Worten zusammen.",
};

export const instructionsSets: Instructions[] = [
  {
    title: "Anweisung 1",
    tasks: [
      "Task 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Task 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Task 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },
  {
    title: "Anweisung 2",
    tasks: [
      "Task A: Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
      "Task B: Nullam varius, turpis et commodo pharetra, est eros bibendum elit.",
      "Task C: Nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis.",
    ],
  },
  {
    title: "Anweisung 3",
    tasks: [
      "Task I: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "Task II: Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
      "Task III: Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.",
    ],
  },
];

export const TARGETS: Target[] = [
  {
    id: 1,
    word: "besuchten",
    correct: "besuchen",
    tense: "present",
    hint: "Das Verb 'besuchen' steht im Präsens.",
  },
  {
    id: 2,
    word: "packten",
    correct: "packen",
    tense: "present",
    hint: "Das Verb 'packen' ist hier im Präsens gefragt.",
  },
  {
    id: 3,
    word: "schien",
    correct: "scheinen",
    tense: "present",
    hint: "Achte auf die Grundform von 'scheinen'.",
  },
];
export const PHRASES = ["Mega!", "Top!", "Super gemacht!", "Genial!"];

export const PART_OF_SPEECH = [
  "Noun",
  "Artikel",
  "Verb",
  "Adjective",
  "Pronomen",
  "Adverb",
  "Preposition",
  "Numerale",
  "Konjunktion",
  "Interjektion",
];

export const PART_VIDEO_FOR_SPEECH: Record<string, string> = {
  Noun: "https://www.youtube.com/embed/VIDEO_ID1",
  Verb: "https://www.youtube.com/embed/VIDEO_ID2",
  Adjective: "https://www.youtube.com/embed/VIDEO_ID3",
};

export const FULL_SENTENCE_GROUPS: SentenceGroup[][] = [
  [
    {
      sentence:
        "Letztes Wochenende besuchten wir meine Großeltern auf dem Land.",
      parts: [
        {
          id: "lw-1",
          text: "Letztes Wochenende",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "b-1",
          text: "besuchten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-1",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "mg-1",
          text: "meine Großeltern",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
        {
          id: "adl-1",
          text: "auf dem Land",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
      ],
    },
    {
      sentence:
        "Schon früh am Morgen packten wir unsere Sachen und fuhren los.",
      parts: [
        {
          id: "sfam-1",
          text: "Schon früh am Morgen",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "p-1",
          text: "packten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-2",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "us-1",
          text: "unsere Sachen",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
        {
          id: "fl-1",
          text: "fuhren los",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
      ],
    },
  ],
  [
    {
      sentence: "Die Sonne schien, und wir genossen die Fahrt.",
      parts: [
        {
          id: "ds-1",
          text: "Die Sonne",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "s-1",
          text: "schien",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-3",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "g-1",
          text: "genossen",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "df-1",
          text: "die Fahrt",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
      ],
    },
    {
      sentence: "Bei der Ankunft begrüßten uns Oma und Opa herzlich.",
      parts: [
        {
          id: "bda-1",
          text: "Bei der Ankunft",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "bg-1",
          text: "begrüßten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "u-1",
          text: "uns",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
        {
          id: "ooo-1",
          text: "Oma und Opa",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "h-1",
          text: "herzlich",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
      ],
    },
  ],
  [
    {
      sentence: "Am Nachmittag kochten wir gemeinsam und lachten viel.",
      parts: [
        {
          id: "an-1",
          text: "Am Nachmittag",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "k-1",
          text: "kochten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-4",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "g-2",
          text: "gemeinsam",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "l-1",
          text: "lachten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "v-1",
          text: "viel",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
      ],
    },
    {
      sentence: "Später spazierten wir durch den Garten und pflückten Äpfel.",
      parts: [
        {
          id: "s-2",
          text: "Später",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "sp-1",
          text: "spazierten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-5",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "ddg-1",
          text: "durch den Garten",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
        {
          id: "p-2",
          text: "pflückten",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "a-1",
          text: "Äpfel",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
      ],
    },
  ],
  [
    {
      sentence:
        "Es war ein wunderschöner Tag, den wir nicht so schnell vergaßen.",
      parts: [
        {
          id: "e-1",
          text: "Es",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-6",
          text: "war",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "ewt-1",
          text: "ein wunderschöner Tag",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
        {
          id: "d-1",
          text: "den",
          correctType: "Objekt im Akkusativ",
          currentType: "",
          highlight: "none",
        },
        {
          id: "w-7",
          text: "wir",
          correctType: "Subjekt",
          currentType: "",
          highlight: "none",
        },
        {
          id: "v-2",
          text: "vergaßen",
          correctType: "Prädikat",
          currentType: "",
          highlight: "none",
        },
        {
          id: "nss-1",
          text: "nicht so schnell",
          correctType: "Adverbiale",
          currentType: "",
          highlight: "none",
        },
      ],
    },
  ],
];

export const QUIZ_QUESTIONS = [
  {
    question: "Was ist ein Substantiv?",
    options: ["Verb", "Noun", "Adjective", "Numerale"],
    correctIndex: 1,
  },
  {
    question: "Welcher Satzteil ist ein Adverbiale?",
    options: ["Artikel", "Verb", "Adverb", "Konjunktion"],
    correctIndex: 2,
  },
  {
    question: "Was beschreibt ein Adjektiv?",
    options: ["Adverb", "Interjektion", "Adjective", "Pronomen"],
    correctIndex: 2,
  },
];

export const INTRO_QA = [
  {
    question: "What is this platform?",
    answer:
      "This is a gamified learning platform focused on English language skills.",
  },
  {
    question: "What can I do here?",
    answer:
      "You can learn grammar, vocabulary, and improve writing by playing interactive tasks.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Some content is free, while full courses can be unlocked anytime.",
  },
];
