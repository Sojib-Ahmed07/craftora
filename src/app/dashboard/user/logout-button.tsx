"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function LogOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh(); // Wipes layout state cache to instantly recalculate access controls
        },
        onError: () => {
          setIsPending(false);
        },
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-neutral-600 hover:text-destructive hover:bg-destructive/5 transition-colors"
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </Button>
  );
}
