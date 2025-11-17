import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "bold" | "text-only" | "danger" | "outline";
}

export function Button({ children, variant, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        (!variant || variant === "primary") && "primary-button",
        variant === "text-only" && "text-button",
        variant === "danger" && "danger-button",
        variant === "outline" && "outline-button",
        variant === "bold" && "bold-button",
        className
      )}
    >
      {children}
    </button>
  );
}
