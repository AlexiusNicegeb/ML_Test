import { forwardRef, ForwardRefExoticComponent, RefAttributes } from "react";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  onClick: () => void;
}

export const Avatar: ForwardRefExoticComponent<
  AvatarProps & RefAttributes<HTMLButtonElement>
> = forwardRef(({ firstName = "", lastName = "", onClick }, ref) => {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="flex flex-col items-center justify-center w-[40px] h-[40px] rounded-full bg-primary "
    >
      <div className="text-[15px] leading-[15px] font-bold uppercase text-white">
        {firstName[0]}
        {lastName[0]}
      </div>
    </button>
  );
});
