export enum FileType {
  JPEG = "jpg",
  PNG = "png",
  SVG = "svg",
  PDF = "pdf",
  DOC = "doc",
  DOCX = "docx",
  XLS = "xls",
  XLSX = "xlsx",
  WEBP = "webp",
}

export interface FileData {
  id: string;
  name: string;
  path: string;
  url: string;
}

export interface FolderData {
  id: string;
  name: string;
  files: FileData[];
  subfolders: FolderData[];
}

export interface Instructions {
  title: string;
  tasks: string[];
}

export interface Feedback {
  id: number;
  message: string;
  offset: number;
  length: number;
  replacements?: string[];
  originalText?: string;
  nodeKey?: string;
  nodeKeys?: string[];
}

export type OnboardingData = {
  schoolType: "matura" | "oberstufe";
  skillLevel: number;
  examTime: "gt3" | "eq3" | "lt1";
};

export type EditorContent = {
  introduction: string;
  task1: string;
  task2: string;
  task3: string;
};

export type TaskKey = "task1" | "task2" | "task3";

export type Target = {
  id: number;
  word: string;
  correct: string;
  tense: string;
  hint?: string;
};

export type WordType = {
  word: string;
  correctType: string;
  expected: string;
  highlight: "none" | "correct" | "incorrect";
};

export type SentencePart = {
  id: string;
  text: string;
  correctType: string;
  currentType: string;
  highlight: "none" | "correct" | "incorrect";
};

export type SentenceGroup = {
  sentence: string;
  parts: SentencePart[];
};

export enum TaskType {
  VIDEO = "VIDEO", // video lesson
  PDF = "PDF", // static PDF content
  TEXT = "TEXT", // static text content
  WRITING = "WRITING", // writing assignment
  QUIZ = "QUIZ", // multiple-choice / open quiz
  DRAG_DROP = "DRAG_DROP", // drag & drop exercise
  ORDERING = "ORDERING", // ordering items exercise
  GAME = "GAME", // interactive game
}

export interface Attempt {
  status: "IN_PROGRESS" | "PASSED" | "FAILED";
  score?: number;
  responses?: any;
  feedback?: any;
  completedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  type: TaskType;
  position: number;
  config: any;
  attempt: Attempt | null;
}

export interface CourseMeta {
  id: number;
  code: string;
  slug?: string;
  title: string;
  description?: string;
  mediaUrl: string;
  price: number;
  discount?: number;
  discountExpiresAt?: string | null;
  createdAt: string;
  tags: string[];
}

export interface Purchase {
  purchasedAt: string;
  pricePaid: number;
  discountApplied: number | null;
}

export interface Progress {
  videoQuizPercent: number;
  writingPercent: number;
  totalPercent: number;
  updatedAt: string;
}

export interface CourseDetail {
  course: CourseMeta;
  purchase: Purchase;
  progress: Progress | null;
}
