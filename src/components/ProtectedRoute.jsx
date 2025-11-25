"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientMiddleware({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const isAuthenticated = !!token;

    const protectedRoutes = [
      "/user",
      "/orders",
      "/cart",
      "/product/wishlist",
      "/wishlist",
      "/address",
      "/payment",
      "/order",
    ];

    const onboardingRoutes = ["/sign-in", "/sign-up" , "send-otp", "get-otp" , "forgot-password" ];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    const isOnboarding = onboardingRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtected && !isAuthenticated) {
      console.log("Redirecting to login...");
      router.push("/auth/sign-in");
      return;
    }

    if (isOnboarding && isAuthenticated) {
      console.log("Already logged in. Redirecting to dashboard...");
      router.push("/");
      return;
    }

    setLoading(false);
  }, [pathname]);

  if (loading) return null;

  return <>{children}</>;
}
