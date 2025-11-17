import { Modal } from "@/app/ui/components/Modal";
import { DUMMY_RESULT } from "./dummy";

export const SubmitModal = ({ onClose }) => {
  return (
    <Modal onClose={onClose} small>
      <h3 className="mb-4 font-bold">Payload Sending:</h3>
      <pre className="mb-6">
        {JSON.stringify({ text: "Lorem ipsum dolor...." }, null, 2)}
      </pre>

      <h3 className="font-bold">Payload Receiving:</h3>
      <pre>{JSON.stringify(DUMMY_RESULT, null, 2)}</pre>
    </Modal>
  );
};
