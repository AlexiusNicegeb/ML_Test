import clsx from "clsx";
import Image from "next/image";
import { PiMountains } from "react-icons/pi";

export const CourseImage = ({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "image-placeholder w-full h-full block",
        !imageUrl && "empty"
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Course Image"
          // width={200}
          // height={200}
          fill
          className={`object-cover ${className} rounded-2xl`}
        />
      ) : (
        <PiMountains size={80} className="text-primary" />
      )}
    </div>
  );
};
