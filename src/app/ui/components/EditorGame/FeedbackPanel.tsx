import { FC } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

interface Props {
  feedbacks: any[];
  setShowErrors: (show: boolean) => void;
}

export const FeedbackPanel: FC<Props> = ({ feedbacks, setShowErrors }) => {
  if (feedbacks.length === 0) return null;

  return (
    <div className="bg-white min-w-[400px] sm:min-w-[0] w-full rounded-3xl shadow-2xl p-8 sm:p-3 flex flex-col gap-2 ">
      <div className="flex items-center justify-between ">
        <h3 className="text-blue-900 font-bold text-lg mb-0">Vale Feedback</h3>
        <button
          onClick={() => setShowErrors(false)}
          className="flex items-center gap-2 rounded-full py-1 px-4 shadow-lg cursor-pointer transition bg-gradient-to-r from-[#00A6F4] to-[#0087C1] text-white font-bold hover:scale-105 hover:shadow-xl z-50"
        >
          Close
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center ">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <h3 className="text-xl font-bold text-green-700">No issues found!</h3>
          <p className="text-sm text-gray-500">
            Great job! Your text looks good.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-red-600 font-bold text-lg mb-2">
            <MdErrorOutline className="text-xl" />
            Issues detected
          </div>
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="p-3 bg-red-50 border-l-4 border-red-400 rounded mb-2"
            >
              <div className="text-sm font-semibold text-red-800">
                Line: <span className="italic">{fb.match}</span>
              </div>
              <div className="text-xs text-gray-800">{fb.message}</div>
              <div className="text-xs italic text-gray-500 mt-1">
                Rule: {fb.rule}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
