import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface CourseNavigationBarProps {
  backPath?: string;
}

export const CourseNavigationBar = ({ backPath }: CourseNavigationBarProps) => {
  return (
    <div className="course-navigation-bar">
      <div className="wrapper">
        <Link className="back-t-prev" href={backPath || "./"}>
          <FaArrowLeft size={20} /> Zurück
        </Link>
      </div>
    </div>
  );
};
