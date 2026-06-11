// src/app/dashboard/admin/users/user-table-wrapper.tsx
"use client";

import { useState } from "react";
import { Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  role?: string | null;
  createdAt: Date | string;
}

export function UserTableWrapper({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);

  const handleDeleteUser = async (id: string, email: string) => {
    if (
      !confirm(
        `CRITICAL DELETION WARNING:\nAre you sure you want to permanently erase account "${email}"? This will terminate all active login sessions immediately.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        const errData = await res.json();
        alert(
          errData.message ||
            "Authorization restriction: Could not drop user account.",
        );
      }
    } catch (err) {
      console.error(err);
      alert("Network dropped connectivity during state transmission.");
    }
  };

  if (users.length === 0) {
    return (
      <div className="p-12 text-center space-y-2">
        <User className="h-8 w-8 text-neutral-300 mx-auto" />
        <h4 className="text-sm font-semibold text-neutral-800">
          No registered profiles discovered
        </h4>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-semibold uppercase text-neutral-500 tracking-wider">
            <th className="p-4 pl-6">Identity Parameter</th>
            <th className="p-4">Email Address</th>
            <th className="p-4">Access Classification</th>
            <th className="p-4">Registration Date</th>
            <th className="p-4 pr-6 text-right">Revocation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
          {users.map((user) => {
            const isAdmin = user.role?.toLowerCase() === "admin";

            return (
              <tr
                key={user.id}
                className="hover:bg-neutral-50/30 transition-colors"
              >
                {/* Name details */}
                <td className="p-4 pl-6 font-semibold text-neutral-900">
                  {user.name || (
                    <span className="text-neutral-400 italic font-normal">
                      Anonymous Identity
                    </span>
                  )}
                </td>

                {/* Email address */}
                <td className="p-4 font-mono text-xs text-neutral-600">
                  {user.email}
                </td>

                {/* Role badge */}
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isAdmin
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : "bg-neutral-100 text-neutral-800 border-neutral-200"
                    }`}
                  >
                    {isAdmin ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3 text-neutral-400" />
                    )}
                    {user.role || "user"}
                  </span>
                </td>

                {/* Date registered */}
                <td className="p-4 text-xs text-neutral-400">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Trigger account drop action */}
                <td className="p-4 pr-6 text-right">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-rose-500 border-neutral-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                    onClick={() => handleDeleteUser(user.id, user.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
