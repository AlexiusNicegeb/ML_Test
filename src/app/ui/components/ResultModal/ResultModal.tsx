import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export const ResultModal = ({
  evaluation,
  subMetrics,
  setIsModalOpen,
}: {
  evaluation: any;
  subMetrics: any;
  setIsModalOpen: any;
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6 ">
      <div className="bg-white sm:overflow-auto sm:max-h-[80vh] sm:p-1 shadow-2xl max-w-3xl w-full p-4 relative border border-gray-100 rounded-2xl">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          <IoIosCloseCircleOutline />
        </button>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Automatische Bewertung
        </h2>

        {evaluation && subMetrics ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
              {Object.entries(evaluation).map(([key, value]) =>
                typeof value === "object" ? (
                  <div
                    key={key}
                    className="rounded-xl border border-gray-200 bg-white shadow-md p-4"
                  >
                    <h3 className="text-blue-600 font-semibold text-lg mb-1">
                      {key}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Punkte:{" "}
                      {
                        //@ts-ignore
                        value.points
                      }
                    </p>
                    <p className="text-sm sm:text-xs text-gray-700">
                      {
                        //@ts-ignore
                        value.comment
                      }
                    </p>
                  </div>
                ) : null
              )}
            </div>

            <hr className="my-6 sm:my-2 border-t border-gray-200" />

            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                Gesamtpunkte:{" "}
                <span className="text-blue-600 font-bold text-xl">
                  {evaluation.total}
                </span>
              </p>
              <p className="text-base">
                Note:{" "}
                <span
                  className={`font-bold ${
                    evaluation.grade === "Sehr Gut"
                      ? "text-green-500"
                      : evaluation.grade === "Gut"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {evaluation.grade}
                </span>
              </p>
            </div>
          </>
        ) : (
          <p>Lade Bewertung...</p>
        )}
      </div>
    </div>
  );
};
