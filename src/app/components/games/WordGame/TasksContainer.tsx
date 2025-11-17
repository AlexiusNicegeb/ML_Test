import { Instructions } from "@/app/types";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

type TasksContainerProps = {
  instructions: Instructions;
  onPrev: () => void;
  onNext: () => void;
};

const TasksContainer = ({
  instructions,
  onPrev,
  onNext,
}: TasksContainerProps) => (
  <div className="relative w-full h-full max-w-4xl justify-between mx-auto bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00A6F4] to-[#0087C1] text-white text-2xl font-extrabold shadow-lg">
          1
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">
          {instructions.title}
        </h2>
      </div>

      {/* Task list */}
      <ul className="flex flex-col gap-6 pl-4 border-l-4 border-[#BEEBFF]">
        {instructions.tasks.map((task, index) => (
          <li key={index} className="relative pl-4">
            <div className="absolute -left-2 top-1 w-4 h-4 bg-gradient-to-br from-[#00A6F4] to-[#0087C1] rounded-full shadow"></div>
            <p className="text-gray-700 text-base leading-relaxed">{task}</p>
          </li>
        ))}
      </ul>
    </div>

    {/* Buttons */}
    <div className="flex justify-between gap-4 mt-4">
      <button
        onClick={onPrev}
        className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 shadow-lg cursor-pointer transition bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold hover:scale-105 hover:shadow-xl"
      >
        <FaRegArrowAltCircleLeft /> Zurück
      </button>

      <button
        onClick={onNext}
        className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 shadow-lg cursor-pointer transition bg-gradient-to-r from-[#00A6F4] to-[#0087C1] text-white font-bold hover:scale-105 hover:shadow-xl"
      >
        Weiter <FaRegArrowAltCircleRight />
      </button>
    </div>
  </div>
);

export default TasksContainer;
