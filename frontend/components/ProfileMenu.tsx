"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/authContext";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useProtectedApi } from "@/hooks/useProtectedApi";
import { FlashMessage } from '@/hooks/useFlashMessage';

interface ProfileMenuProps{
    setMessageFlash: React.Dispatch<React.SetStateAction<FlashMessage | null >>
}

import React from 'react'

const ProfileMenu: React.FC<ProfileMenuProps> = ({setMessageFlash}) => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const api = useProtectedApi();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setOpen(false), open);

  // Fetch auth on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/check-auth", { withCredentials: true });
        if (!mounted) return;
        setUser(res.data?.isAuthenticated ? res.data.user : null);
      } catch {
        if (!mounted) return;
        setUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [api, setUser]);

  const logout = async () => {
    try {
      await api.get("/logout", { withCredentials: true });
      setUser(null);
      setMessageFlash({ type: "success", text: "Logged out successfully" });
      router.push('/')
    } catch {
      setMessageFlash({ type: "error", text: "Couldn't logout" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserCircleIcon className="h-7 w-7 text-gray-700" />
        <span className="font-semibold text-gray-700 hidden sm:block">
          Profile
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50"
        >
          {user ? (
            <>
              <button
                role="menuitem"
                className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
                onClick={() => {
                  router.push("/profile");
                  setOpen(false);
                }}
              >
                My Account
              </button>

              <button
                role="menuitem"
                className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={logout}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                role="menuitem"
                className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  router.push("/login");
                  setOpen(false);
                }}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                Login
              </button>

              <button
                role="menuitem"
                className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  router.push("/signup");
                  setOpen(false);
                }}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default ProfileMenu;