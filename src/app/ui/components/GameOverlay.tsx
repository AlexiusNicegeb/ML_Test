export const GameOverOverlay = ({ onRestart }: { onRestart: () => void }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white z-30">
    <h1 className="text-4xl font-bold mb-4">Game Over</h1>
    <button
      onClick={onRestart}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Neu Starten
    </button>
  </div>
);
