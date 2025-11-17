import { useUserAuth } from "@/app/context/user/UserAuthContext";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export const UserAvatar = () => {
  const router = useRouter();
  const { logout, user } = useUserAuth();
  const ref = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  useOutsideClick(() => setShowUserDropdown(false), [ref, avatarRef]);

  return (
    <div className="user-avatar">
      {user ? (
        <div className="ml-auto">
          <div className="relative">
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              ref={avatarRef}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            />

            <div
              className={clsx("user-dropdown", showUserDropdown && "show")}
              ref={ref}
            >
              <div className="user-top">
                <h3>
                  {user.firstName} {user.lastName}
                </h3>

                <p>{user.email}</p>
              </div>
              <Button
                variant="text-only"
                onClick={async () => {
                  await logout();
                  router.replace("/");
                  location.reload();
                }}
              >
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Link className="nav-link" href="/login">
            Login
          </Link>
          <Link className="nav-link-register" href="/register">
            <FaArrowRight size={20} />
            Registrieren
          </Link>
        </div>
      )}
    </div>
  );
};
