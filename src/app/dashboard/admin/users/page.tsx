// src/app/dashboard/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { Users, ShieldCheck, ShieldAlert } from "lucide-react";
import { UserTableWrapper } from "./user-table-wrapper";

async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("FETCH_USERS_DIRECTORY_ERROR:", err);
    return [];
  }
}

export default async function AdminUsersDirectoryPage() {
  const users = await getAllUsers();

  // Calculate directory diagnostics
  const totalUsers = users.length;
  const adminCount = users.filter(
    (u: any) => u.role === "admin" || u.role === "ADMIN",
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Ribbon */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Client Directory
          </h1>
          <p className="text-sm text-neutral-500">
            Monitor registered platform accounts, audit roles, and terminate
            user credentials.
          </p>
        </div>

        {/* Aggregates Dashboard Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-neutral-100 text-neutral-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Client Profiles
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                {totalUsers}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                System Administrators
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                {adminCount}
              </h3>
            </div>
          </div>
        </div>

        {/* Interactive Client Wrapper Component */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <UserTableWrapper initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
