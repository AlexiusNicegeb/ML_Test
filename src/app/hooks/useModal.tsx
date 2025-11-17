import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const useModal = () => {
  const [modal, setModal] = useState<JSX.Element | null>(null);

  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    if (modal) {
      document.addEventListener("keydown", handleKeyboard);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [modal]);

  const openModal = (content: JSX.Element) => {
    setModal(createPortal(content, document.body));
  };

  const closeModal = () => {
    setModal(null);
  };

  return {
    modal,
    openModal,
    closeModal,
  };
};
