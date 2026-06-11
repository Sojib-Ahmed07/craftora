"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import React from "react";

// FIX: Changed from an empty interface to a clean type alias declaration
export type CustomLinkProps = React.ComponentProps<typeof Link>;

export function CustomLink({
  href,
  children,
  onClick,
  ...props
}: CustomLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;

    if (onClick) onClick(e);

    e.preventDefault();
    NProgress.start();

    router.push(href.toString());
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}