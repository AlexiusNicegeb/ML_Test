import clsx from "clsx";
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

interface ModalProps {
  children: React.ReactNode;
  onClose?: (data?: any) => void;
  small?: boolean;
}

export interface CustomModalRef {
  closeModal: (data?: any) => void;
}

export const Modal: ForwardRefExoticComponent<
  ModalProps & RefAttributes<CustomModalRef>
> = forwardRef(({ children, onClose, small }: ModalProps, ref) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [fadeInClass, setFadeInClass] = useState("");

  const closeModal = (data?: unknown) => {
    setFadeInClass("");

    setTimeout(() => {
      onClose?.(data);
    }, 600);
  };

  useImperativeHandle(ref, () => ({
    closeModal,
  }));

  useEffect(() => {
    if (!fadeInClass) {
      setTimeout(() => {
        setFadeInClass("animate-in");
      }, 50);
    }

    function handleKeyboard(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
    const firstInput = modalRef.current?.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    } else {
      modalRef.current?.querySelector("button")?.focus();
    }

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  return createPortal(
    <div className={clsx("modal-wrapper", fadeInClass)} ref={modalRef}>
      <div className={clsx("modal", small && "small")}>
        <div className="modal-header">
          <Button variant="text-only" onClick={() => closeModal()}>
            Schließen
          </Button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body
  );
});
