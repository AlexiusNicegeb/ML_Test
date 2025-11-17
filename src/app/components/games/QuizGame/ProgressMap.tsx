import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaCircle, FaLock } from "react-icons/fa6";

export const ProgressMap = ({
  current,
  total,
  results,
}: {
  current: number;
  total: number;
  results: ("correct" | "wrong" | null)[];
}) => {
  return (
    <div className="flex justify-center items-center gap-3 mt-2 flex-wrap">
      {Array.from({ length: total }).map((_, idx) => {
        if (idx < current) {
          const result = results[idx];
          if (result === "correct") {
            return (
              <FaCheckCircle
                key={idx}
                className="text-green-500 w-6 h-6"
                title={`Level ${idx + 1} ✔`}
              />
            );
          } else if (result === "wrong") {
            return (
              <FaTimesCircle
                key={idx}
                className="text-red-500 w-6 h-6"
                title={`Level ${idx + 1} ✘`}
              />
            );
          }
        }
        if (idx === current)
          return (
            <FaCircle
              key={idx}
              className="text-blue-500 animate-pulse w-6 h-6"
              title={`Aktuell: Level ${idx + 1}`}
            />
          );
        return (
          <FaLock
            key={idx}
            className="text-gray-400 w-6 h-6"
            title={`Gesperrt`}
          />
        );
      })}
    </div>
  );
};
