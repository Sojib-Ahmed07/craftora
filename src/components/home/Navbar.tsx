"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

// Import useSession and signOut from your auth client setup
import { useSession, signOut } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Destructure session details from Better Auth
  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // Force redirect to login page upon clean session wipe
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-tight"
        >
          Craftora
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Explore
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>

          {/* Render extra links conditionally matching the document guidelines */}
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/orders"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Orders
              </Link>
            </>
          )}
        </div>

        {/* Action Controls Side Element */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            // Shimmer/Empty placeholder gap during active authentication pass checks
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full border bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-muted-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl mt-1" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-2 rounded-lg"
                >
                  <Link href="/profile">
                    <User size={16} />
                    Profile Info
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-2 rounded-lg"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive gap-2 rounded-lg"
                >
                  <LogOut size={16} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Button size="sm" className="rounded-xl px-4" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-1 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Accordion Navigation Panel */}
      {isOpen && !isPending && (
        <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3 animate-fade-in">
          <Link
            href="/"
            className="text-sm font-medium py-1"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium py-1"
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium py-1"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium py-1"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {isLoggedIn ? (
            <>
              <div className="h-px bg-border my-1" />
              <div className="px-1 py-1.5 flex flex-col space-y-0.5">
                <span className="text-xs font-semibold text-foreground">
                  {session.user.name}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {session.user.email}
                </span>
              </div>
              <Link
                href="/profile"
                className="text-sm font-medium py-1 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                Profile Info
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium py-1 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-sm font-medium py-2 text-left text-destructive mt-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-border my-1" />
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  className="w-full rounded-xl"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
