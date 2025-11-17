import { ClockIcon } from "../assets/icons/ClockIcon";
import { PlayIcon } from "../assets/icons/PlayIcon";
import { CourseImage } from "./CourseImage";

interface CourseModuleProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  onClick?: () => void;
  showInfo?: () => void;
  isActive?: boolean;
}

export const CourseModule = ({
  imageUrl,
  title,
  description,
  isActive,
  onClick
}: CourseModuleProps) => {


  return (
    <div className={`course-module ${isActive ? "active-module" : ""}`} onClick={onClick}>
      <div className="course-module__info">
        <CourseImage imageUrl={imageUrl} />

        <div className="course-module__content" >
          <h3 className="course-module__title">{title}</h3>
          <p className="course-module__description">{description}</p>
          {isActive && <p className="course-module-active">Aktiv</p>}
          <div className="course-module__meta mt-8 font-bold uppercase">
            <div className="course-module__time flex gap-2 items-center">
              <ClockIcon color={"rgb(7, 61, 94)"}/>
              <span className="course-module__meta-item">104 min.</span>
            </div>
            
            <div className="course-module-progress">
              <p>Progress: 10%</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="course-module__actions">
        <button className="course-module__action" onClick={onClick}>
          <PlayIcon height="25px" width="25px" showHide={icon}/>
          <span>{btnText}</span>
        </button>
      </div> */}
    </div>
  );
};
