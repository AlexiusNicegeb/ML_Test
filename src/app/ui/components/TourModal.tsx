export function TourModal({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <div className="bg-white/90 shadow-2xl border border-blue-200 rounded-3xl px-8 py-6 max-w-md w-[90%] text-center">
        <p className="text-xl font-semibold text-gray-800 mb-6">
          Möchtest du eine Tour durch die Seite machen?
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onAccept}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2 px-6 rounded-full transition"
          >
            Ja
          </button>
          <button
            onClick={onDecline}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition"
          >
            Nein
          </button>
        </div>
      </div>
    </div>
  );
}
