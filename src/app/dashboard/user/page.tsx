import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogOutButton } from "./logout-button"; // We will build this client button next
import { LayoutDashboard, User, Shield, Clock, Database } from "lucide-react";

export default async function DashboardPage() {
  // 1. Fetch the server-side verified session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Server-side redirect if unauthorized
  if (!session) {
    redirect("/login");
  }

  // 3. Optional: You can run database queries directly via Prisma right here!
  // For example, finding items assigned exclusively to this logged-in individual:
  // const userItems = await prisma.item.findMany({ where: { userId: session.user.id } });

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Navigation Strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500">
                Welcome back, {session.user.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Injecting the client components for interactable buttons */}
            <LogOutButton />
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: User Profile Context */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Logged In As
                </p>
                <h3 className="text-lg font-semibold text-neutral-800 truncate max-w-[200px]">
                  {session.user.name}
                </h3>
                <p className="text-xs text-neutral-500 truncate max-w-[220px]">
                  {session.user.email}
                </p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Database Account ID Mapping */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Internal Reference
                </p>
                <h3 className="text-sm font-mono text-neutral-700 bg-neutral-50 p-1 rounded break-all select-all">
                  {session.user.id}
                </h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Database className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Security Clearances */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Assigned Clearance
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize mt-1 ${
                    session.user.role === "admin"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  <Shield className="h-3 w-3" />
                  {session.user.role || "user"}
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-800 font-semibold">
            <Clock className="h-4 w-4 text-neutral-400" />
            <h2>Active Token Payload Session State</h2>
          </div>
          <pre className="text-xs font-mono bg-neutral-900 text-neutral-200 p-4 rounded-lg overflow-x-auto selection:bg-neutral-700">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
