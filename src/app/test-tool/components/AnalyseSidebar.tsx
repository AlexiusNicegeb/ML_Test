import clsx from "clsx";
import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import {
  AnalyseResult,
  AnalyseResultError,
  AnalyseResultErrorItem,
} from "../types/result";

export const AnalyseSidebar = ({
  result,
  activeCategory,
  onOpenSuggestionModal,
}: {
  result: AnalyseResult;
  activeCategory: number;
  onOpenSuggestionModal: (
    error: AnalyseResultError,
    item: AnalyseResultErrorItem
  ) => void;
}) => {
  const category = result.categories[activeCategory];
  const errors = category.errors || [];

  return (
    <div className="analyse-sidebar">
      <h3 className="font-bold mb-6">{category.name}</h3>
      {errors.length === 0 && <p className="mb-4">Keine Fehler</p>}
      {errors.map((error, i) => (
        <ErrorDropdown
          key={i}
          error={error}
          onOpenSuggestionModal={onOpenSuggestionModal}
        />
      ))}
    </div>
  );
};

const ErrorDropdown = ({
  error,
  onOpenSuggestionModal,
}: {
  error: AnalyseResultError;
  onOpenSuggestionModal: (
    error: AnalyseResultError,
    item: AnalyseResultErrorItem
  ) => void;
}) => {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        type="button"
        key={error.name}
        className={clsx("error-dropdown", active && "active")}
        onClick={() => setActive(!active)}
      >
        <span className="error-pill">{error.items.length}</span>
        <h4>{error.name}</h4>
        <div className="dropdown-circle">
          <IoIosArrowDropdownCircle size={25} />
        </div>
      </button>
      <div className="error-wrapper">
        {error.items.map((item, idx) => (
          <button
            type="button"
            key={idx}
            className="error-item"
            onClick={() => onOpenSuggestionModal(error, item)}
          >
            <p className="error-word">{item.type}</p>
            <p className="error-message">"{item.error}"</p>
          </button>
        ))}
      </div>
    </>
  );
};
