import { TaskKey } from "@/app/types";
import { FC } from "react";

interface TaskSwitcherProps {
  activeTask: TaskKey;
  setActiveTask: (task: TaskKey) => void;
  taskSubmitted?: Record<number, Record<TaskKey, boolean>>;
  activeRound?: number;
}

const tasks: { key: TaskKey; label: string }[] = [
  { key: "task1", label: "Aufgabe 1" },
  { key: "task2", label: "Aufgabe 2" },
  { key: "task3", label: "Aufgabe 3" },
];

export const TaskSwitcher: FC<TaskSwitcherProps> = ({
  activeTask,
  setActiveTask,
  taskSubmitted,
  activeRound,
}) => (
  <div className="flex gap-2">
    {tasks.map(({ key, label }) => {
      const isActive = activeTask === key;
      const isSubmitted = taskSubmitted?.[activeRound]?.[key];
      const baseClass =
        "px-3 py-1 rounded-full font-semibold border transition flex items-center gap-1";
      const activeClass = isActive
        ? "bg-blue-800 text-white border-blue-800"
        : "bg-white text-blue-800 border-blue-800";
      const submittedClass = isSubmitted
        ? "bg-green-100 border-green-400 text-green-800"
        : "";

      return (
        <button
          key={key}
          onClick={() => setActiveTask(key)}
          className={`${baseClass} ${activeClass} ${submittedClass}`}
        >
          {label}
          {isSubmitted && (
            <span className="text-green-600 text-sm ml-1">✓</span>
          )}
        </button>
      );
    })}
  </div>
);
