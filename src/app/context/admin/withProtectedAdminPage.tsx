import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Robot } from "../../ui/components/Robot";
import { useUserAuth } from "../user/UserAuthContext";

const withProtectedAdminPage = (WrappedComponent: any) => {
  return (props: any) => {
    const { user, loading } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
      (async () => {
        if (!loading && (!user || user.role !== "ADMIN")) {
          router.replace("/");
        }
      })();
    }, [user, router, loading]);

    if (loading) {
      return <Robot />;
    }

    if (user && user.role === "ADMIN") {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withProtectedAdminPage;
