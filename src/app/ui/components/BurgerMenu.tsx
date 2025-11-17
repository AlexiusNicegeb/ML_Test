import { BURGER_MENU_ANIMATION_CLASS } from "@/app/constants";
import clsx from "clsx";
import { useEffect } from "react";

interface BurgerMenuProps {
  open: boolean;
  onToggle?: (open: boolean) => void;
}

export const BurgerMenu = ({ onToggle, open }: BurgerMenuProps) => {
  useEffect(() => {
    document.body.classList.add(BURGER_MENU_ANIMATION_CLASS);
    setTimeout(() => {
      document.body.classList.remove(BURGER_MENU_ANIMATION_CLASS);
    }, 400);
  }, [open]);

  return (
    <button
      type="button"
      id="burger-button"
      className={clsx("burger-menu", open && "open")}
      onClick={() => {
        const state = !open;

        onToggle?.(state);
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
