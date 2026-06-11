import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Mail, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutButton } from "./logout-button";

export default async function UserDashboardPage() {
  // 1. Fetch server-side verified session context
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Server-side redirect if unauthorized or unauthenticated
  if (!session) {
    redirect("/login");
  }

  // Calculate uppercase name initials for avatar fallback
  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50/40 px-4 py-12">
      {/* Consolidated Master Dashboard Frame */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        {/* Left Aspect: Verified Identity Info (3 Columns wide) */}
        <div className="p-6 md:col-span-3 flex flex-col justify-between space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border border-neutral-200 shadow-sm shrink-0">
              <AvatarImage
                src={session.user.image || undefined}
                alt={session.user.name || "Client User"}
              />
              <AvatarFallback className="bg-neutral-950 text-white font-bold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <h2 className="text-base font-bold tracking-tight text-neutral-900 truncate">
                {session.user.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span className="truncate font-mono">{session.user.email}</span>
              </div>
            </div>
          </div>

          {/* Security & Role Identity Attributions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Account Verified
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200/60">
              {session.user.role || "Standard Client"}
            </span>
          </div>
        </div>

        {/* Right Aspect: Interactive Logistics Actions (2 Columns wide) */}
        <div className="p-6 md:col-span-2 bg-neutral-50/40 flex flex-col justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Logistics Workspace
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Track active fulfillment states, shipments, and previous purchase
              receipts.
            </p>
          </div>

          {/* Action Trigger Elements */}
          <div className="space-y-2">
            <Link
              href="/orders"
              className="w-full h-10 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              My Orders
              <ArrowRight className="h-3.5 w-3.5 ml-0.5 opacity-80" />
            </Link>

            <LogOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
