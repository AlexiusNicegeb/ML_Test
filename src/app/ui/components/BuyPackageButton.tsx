import { CoursePackage } from "@/app/models/course-package";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";

export const BuyPackageButton = ({
  className,
  coursePackage,
}: {
  coursePackage: CoursePackage;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    let res: Response;
    try {
      res = await fetch("/api/checkout-course-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coursePackageId: coursePackage.id,
          baseUrl: window.location.origin,
        }),
      });
    } catch (networkError) {
      console.error("Network error:", networkError);
      alert("Network error, please try again later.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      let errMsg: string;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const errJson = await res.json().catch(() => null);
        errMsg = errJson?.error || JSON.stringify(errJson) || res.statusText;
      } else {
        errMsg = await res.text();
      }
      console.error("API error:", errMsg);
      alert("Payment error: " + errMsg);
      setLoading(false);
      return;
    }

    let data: { url?: string; error?: string };
    try {
      data = await res.json();
    } catch {
      console.error("Response is not valid JSON!");
      alert("Invalid server response format.");
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("No redirect URL received:", data);
      alert("Server did not provide a payment URL.");
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleBuy} disabled={loading} className={className}>
      Jetzt kaufen
    </Button>
  );
};
