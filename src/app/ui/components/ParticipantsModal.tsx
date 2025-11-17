import { useRouter } from "next/navigation";
import { useRef } from "react";
import { CustomModalRef, Modal } from "./Modal";

interface CustomModalProps {
  onClose: () => void;
  participants: any[];
}

export const ParticipantsModal = ({
  participants,
  onClose,
}: CustomModalProps) => {
  const modalRef = useRef<CustomModalRef>(null);
  const router = useRouter();

  return (
    <Modal onClose={onClose} small ref={modalRef}>
      <h2 className="text-2xl font-extrabold mb-6 text-[#003366]">
        Teilnehmer
      </h2>
      {participants.length === 0 ? (
        <p className="text-gray-600 text-center">Keine Teilnehmer vorhanden.</p>
      ) : (
        <ul className="space-y-4">
          {participants.map((p, index) => (
            <li
              key={index}
              className="bg-white/90 backdrop-blur-md border border-[#d0e7ff] rounded-xl shadow-md hover:shadow-xl transition-all p-4 flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xl font-bold uppercase">
                {p?.firstName.slice(0, 1)}
              </div>

              <div className="flex-grow">
                <div className="font-semibold text-[#003366]">
                  {p?.firstName + " " + p?.lastName}
                </div>
                <div className="text-sm text-gray-600">{p?.email}</div>
              </div>

              <button
                onClick={() => router.push(`/result?userId=${p.id}`)}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold shadow hover:shadow-lg hover:scale-105 transition"
              >
                View Results
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
