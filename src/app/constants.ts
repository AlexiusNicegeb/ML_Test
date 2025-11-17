import { env } from "next-runtime-env";
import { ToastOptions } from "react-toastify";
export const IS_PRODUCTION =
  process.env.NODE_ENV === "production" || env("NEXT_PUBLIC_FORCE_PRODUCTION");
export const PAGE_ADMIN_BODY_CLASS = "page-admin";
export const GAMES = ["wort-spiel"];
export const BURGER_MENU_ANIMATION_CLASS = "burger-menu-animating";
export const GET_FILES_TOKEN = "KV0mbBKl2yqn8kRD8FKP";

export const TOAST_DEFAULT_MESSAGE = "Ein Fehler ist aufgetreten!";
export const TOAST_DEFAULT_CONFIG: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
};

export const CATEGORY_NAME_UPPER_LOWER_CASE = "Groß- und Kleinschreibung";
export const CATEGORY_NAME_COMMA = "Beistriche";

export const STRIPE_PUBLIC_KEY =
  "pk_test_51QiJayDUGdP21dZPOQPxBwBgSgc7PBLGMbcpCDMr4L9Z6dryBmzEDRCv8aa2ghGyW5Ow6yzM9IFdvuO1qaaFd4ve00JqwGLZTc";

export const gradientThemes = {
  red: ["#FEE2E2", "#FECACA"],
  green: ["#D1FAE5", "#A7F3D0"],
  yellow: ["#ECFCCB", "#D9F99D"],
  blue: ["#E0E7FF", "#C7D2FE"],
  pink: ["#FCE7F3", "#FBCFE8"],
  peach: ["#FFE7D1", "#FCD9B6"],
};
