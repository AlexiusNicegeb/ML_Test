import { useModal } from "@/app/hooks/useModal";
import { cloneDeep } from "lodash";
import { useState } from "react";
import {
  AnalyseResult,
  AnalyseResultError,
  AnalyseResultErrorItem,
} from "../types/result";
import { AnalyseHeader } from "./AnalyseHeader";
import { AnalyseSidebar } from "./AnalyseSidebar";
import { AnalyseText } from "./AnalyseText";
import { SubmitModal } from "./SubmitModal";
import { SuggestionModal } from "./SuggestionModal";

export const Analyse = ({
  result,
  text,
}: {
  result: AnalyseResult;
  text: string;
}) => {
  const { modal, openModal, closeModal } = useModal();
  const [currentResult, setCurrentResult] = useState<AnalyseResult>(result);
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const onSubmit = () => {
    openModal(<SubmitModal onClose={closeModal} />);
  };

  const onTakenOver = (
    newText: string,
    error: AnalyseResultError,
    errorItem: AnalyseResultErrorItem
  ) => {
    const resultClone: AnalyseResult = cloneDeep(currentResult);
    const errorToUpdate = resultClone.categories[activeCategory].errors.find(
      (e) => e.id === error.id
    );

    errorToUpdate.items = errorToUpdate.items.map((it) =>
      it.id === errorItem.id
        ? {
            ...it,
            newText,
          }
        : it
    );
    setCurrentResult(resultClone);
  };

  const openSuggestionModal = (
    error: AnalyseResultError,
    item: AnalyseResultErrorItem
  ) => {
    openModal(
      <SuggestionModal
        errorItem={item}
        onClose={closeModal}
        onTakenOver={(newText) => {
          onTakenOver(newText, error, item);
          closeModal();
        }}
      />
    );
  };

  return (
    <div className="page-wrapper">
      <div className="analyse box">
        <AnalyseHeader
          result={currentResult}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <div className="flex gap-14">
          <AnalyseSidebar
            result={currentResult}
            activeCategory={activeCategory}
            onOpenSuggestionModal={openSuggestionModal}
          />
          <AnalyseText
            result={currentResult}
            text={text}
            activeCategory={activeCategory}
            onOpenSuggestionModal={openSuggestionModal}
          />
        </div>
        <button onClick={onSubmit} className="submit-button" type="button">
          Abgeben
        </button>
      </div>
      {modal}
    </div>
  );
};
