import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { AnalyseResult } from "../types/result";

export const AnalyseHeader = ({
  result,
  activeCategory,
  setActiveCategory,
}: {
  result: AnalyseResult;
  activeCategory: number;
  setActiveCategory: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="header">
      <div className="category-scores">
        {result.categories.map((cat, index) => {
          return (
            <div
              key={cat.id}
              className={clsx(
                "score-pill",
                activeCategory === index && "active"
              )}
              onClick={() => setActiveCategory(index)}
            >
              <div className="cat-wrapper">
                <div className="category-name">{cat.name}</div>
                <div className="score-display-wrapper">
                  <div className="score-display">{cat.score}%</div>
                </div>
                <div
                  className="percentage-bar"
                  style={{
                    width: activeCategory === index ? `${cat.score}%` : "0%",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="total-score-container">
        <div className="total-score-value">{result.totalScore}%</div>
        <div className="total-score-label">Gesamt</div>
      </div>
    </div>
  );
};
