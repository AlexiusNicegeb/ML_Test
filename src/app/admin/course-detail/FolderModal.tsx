import { Button } from "@/app/ui/components/Button";
import { CustomModalRef, Modal } from "@/app/ui/components/Modal";
import { useRef, useState } from "react";
interface FolderModalProps {
  onClose: () => void;
  onAddFolder: (folderName: string) => void;
}
export const FolderModal = ({ onClose, onAddFolder }: FolderModalProps) => {
  const modalRef = useRef<CustomModalRef>(null);
  const [folderName, setFolderName] = useState("");

  const closeModal = () => {
    modalRef.current?.closeModal();
  };

  const onSubmit = () => {
    if (!folderName) return;
    onAddFolder(folderName);
    closeModal();
  };

  return (
    <Modal small onClose={onClose} ref={modalRef}>
      <div className="mb-6">
        <label htmlFor="foldername" className="block text-sm mb-2">
          Wie soll der Ordner heißen?
        </label>
        <input
          id="foldername"
          type="text"
          placeholder="Ordnername"
          className="w-full"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!folderName}
          variant="primary"
          onClick={() => {
            onSubmit();
          }}
        >
          Hinzufügen
        </Button>
        <Button
          variant="text-only"
          onClick={() => {
            closeModal();
          }}
        >
          Abbrechen
        </Button>
      </div>
    </Modal>
  );
};
