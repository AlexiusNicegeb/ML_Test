export interface AnalyseResult {
  totalScore: number;
  categories: AnalyseResultCategory[];
}

export interface AnalyseResultErrorItem {
  id: string;
  type: string;
  error: string;
  suggestion: string;
  position: number;
  newText?: string;
}

export interface AnalyseResultError {
  id: string;
  name: string;
  items: AnalyseResultErrorItem[];
}

export interface AnalyseResultCategory {
  id: string;
  name: string;
  score: number;
  errors?: AnalyseResultError[];
}
