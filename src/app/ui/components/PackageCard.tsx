import { formatPrice } from "@/app/helpers";
import { CoursePackage } from "@/app/models/course-package";
import { motion } from "framer-motion";
import { BuyPackageButton } from "./BuyPackageButton";
import { CourseImage } from "./CourseImage";

export const PackageCard = ({
  coursePackage,
}: {
  coursePackage: CoursePackage;
}) => {
  return (
    <motion.div className="course-card">
      <div className="course-card-image-wrapper">
        <CourseImage imageUrl={coursePackage.mediaUrl} />
      </div>
      <div className="flex-1 flex flex-col align-start justify-start p-3">
        <h2 className="text-lg mb-0 font-extrabold text-[#003366] truncate">
          {coursePackage.title}
        </h2>
        <h2 className="course-price">{formatPrice(coursePackage.price)}</h2>
        <BuyPackageButton className="mt-auto" coursePackage={coursePackage} />
      </div>
    </motion.div>
  );
};
