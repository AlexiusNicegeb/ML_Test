import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Robot } from "../../ui/components/Robot";
import { useUserAuth } from "./UserAuthContext";
const withProtectedUserPage = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { user, loading } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login");
      }
    }, [user, router, loading]);

    if (loading) {
      return <Robot />;
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withProtectedUserPage;
