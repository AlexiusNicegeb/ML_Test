import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { CustomModalRef, Modal } from "./Modal";

interface DeleteModalProps {
  headline?: string;
  subheadline?: string;
  onDelete: () => void;
  onClose: () => void;
  isDeleting?: boolean;
}

export const DeleteModal = ({
  headline: hl,
  subheadline: sh,
  onDelete,
  onClose,
  isDeleting = false,
}: DeleteModalProps) => {
  // Store in ref that cant be changed from the outside
  const headline = useRef(hl);
  const subheadline = useRef(sh);
  const modalRef = useRef<CustomModalRef>(null);
  const [deleting, setDeleting] = useState(isDeleting);

  useEffect(() => {
    if (!isDeleting && deleting) {
      modalRef.current?.closeModal();
    } else {
      setDeleting(isDeleting);
    }
  }, [isDeleting]);

  return (
    <Modal small onClose={onClose} ref={modalRef}>
      <div className="mb-6">
        <h1>{headline.current ?? "Wirklich löschen?"}</h1>
        {subheadline.current && (
          <p className="mb-8 text-faded">{subheadline.current}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="danger"
            disabled={isDeleting}
            onClick={() => {
              onDelete();
            }}
          >
            Löschen
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modalRef.current?.closeModal();
            }}
          >
            Abbrechen
          </Button>
        </div>
      </div>
    </Modal>
  );
};
