"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe, refreshToken } from "../core/api/auth.api";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/login") {
        const token = localStorage.getItem("accessToken");

        if (token) {
          router.replace("/");
          return;
        }

        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      try {
        await getMe();

        setLoading(false);
      } catch {
        try {
          if (!storedRefreshToken) {
            throw new Error();
          }

          const result = await refreshToken(storedRefreshToken);

          localStorage.setItem("accessToken", result.accessToken);

          localStorage.setItem("refreshToken", result.refreshToken);

          setLoading(false);
        } catch {
          localStorage.clear();

          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [pathname]);

  if (loading && pathname !== "/login") {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return <>{children}</>;
}
