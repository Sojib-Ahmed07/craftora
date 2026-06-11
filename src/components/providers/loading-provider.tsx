"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

// Configure the loading bar options
NProgress.configure({
  showSpinner: false, // Turn off the circular spinner
  speed: 400, // How fast the bar moves
  minimum: 0.25, // Where the bar starts charging from
});

export function UniversalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Complete the loading animation whenever the path or search query parameters change
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return (
    <>
      {/* Global CSS injection to style the loading bar */}
      <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: #0a0a0a; /* Customize this to match your app theme color (e.g. neutral-950) */
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px; /* Thin, sleek loading strip line */
        }
      `}</style>
      {children}
    </>
  );
}
