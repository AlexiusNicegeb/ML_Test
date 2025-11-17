import {
  AnalyseResult,
  AnalyseResultError,
  AnalyseResultErrorItem,
} from "../types/result";
import { highlightErrors } from "./utils/errors";

export const AnalyseText = ({
  result,
  text,
  activeCategory,
  onOpenSuggestionModal,
}: {
  result: AnalyseResult;
  text: string;
  activeCategory: number;
  onOpenSuggestionModal: (
    error: AnalyseResultError,
    item: AnalyseResultErrorItem
  ) => void;
}) => {
  const category = result.categories[activeCategory];
  const highlighted = highlightErrors(text, category);

  const openSuggestionModal = (m: {
    text: string;
    error?: {
      errorId: string;
      itemId: string;
    };
  }) => {
    if (!m.error) {
      return;
    }
    const error = category.errors.find((e) => e.id === m.error.errorId);
    const item = error.items.find((e) => e.id === m.error.itemId);
    onOpenSuggestionModal(error, item);
  };

  return (
    <div className="analyse-text">
      {highlighted.map((t) => {
        return t.error ? (
          t.error.newText ? (
            <span
              key={t.error.errorId}
              className="error-highlight-changed"
              onClick={() => openSuggestionModal(t)}
            >
              {t.error.newText}
            </span>
          ) : (
            <span
              key={t.error.errorId}
              className="error-highlight"
              onClick={() => openSuggestionModal(t)}
            >
              {t.text}
            </span>
          )
        ) : (
          t.text
        );
      })}
    </div>
  );
};
