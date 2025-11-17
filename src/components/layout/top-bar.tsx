"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      await supabase.auth.signOut();
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = getInitials(user?.user_metadata?.full_name, user?.email || null);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <span className="text-slate-400">🔍</span>
          <span>Search dashboards, clients, or jobs</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <span className="font-medium text-slate-900">Advanced Hospital Staffing</span>
          <span className="text-xs text-slate-400">▼</span>
        </div>
      </div>

      <div className="relative flex items-center gap-5 text-sm text-slate-600">
        {!loading && user && (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {initials}
            </span>
            <span className="hidden sm:inline">{displayName}</span>
            <span className="text-xs text-slate-400">{menuOpen ? "▲" : "▼"}</span>
          </button>
        )}

        {menuOpen && user && (
          <div
            ref={menuRef}
            className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div className="py-1 text-sm">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-medium text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>
              <button
                type="button"
                className="flex w-full items-center px-4 py-2 text-left text-slate-600 hover:bg-slate-50"
                disabled
              >
                User settings
                <span className="ml-auto text-[10px] rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-400">
                  Soon
                </span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
