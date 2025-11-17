import { v4 } from "uuid";
import { AnalyseResult, AnalyseResultError } from "../types/result";

export const mapAnalyseResult = (data: any): AnalyseResult => {
  return {
    totalScore: data.totalScore,
    categories: data.categories.map((cat: any) => {
      return {
        id: v4(),
        name: cat.name,
        score: cat.score,
        errors: mapErrorItems(cat.errors || []),
      };
    }),
  };
};

const mapErrorItems = (errors?: any[]): AnalyseResultError[] => {
  return (errors || []).map((err: any) => ({
    id: v4(),
    name: err.name,
    items: err.items.map((item: any) => ({
      id: v4(),
      type: item.type,
      error: item.error,
      suggestion: item.suggestion,
      position: item.position,
    })),
  }));
};
