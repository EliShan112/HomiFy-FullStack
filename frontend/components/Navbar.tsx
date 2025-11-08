"use client";

import MessageFlash from "./MessageFlash";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { messageFlash, setMessageFlash } = useFlashMessage(3000);

  return (
    <div className="w-screen flex flex-col items-center p-4 rounded-2xl shadow-lg">
      {messageFlash && (
        <div className="mb-2 z-[999] relative">
          <MessageFlash type={messageFlash.type} text={messageFlash.text} />
        </div>
      )}

      {/* top row */}
      <div className="flex justify-between items-center w-full max-w-6xl">
        <div className="w-20" />

        <SearchBar />

        <div className="w-20 flex justify-end ml-3">
          {/* pass flash setter so ProfileMenu can show success/error */}
          <ProfileMenu setMessageFlash={setMessageFlash} />
        </div>
      </div>

      <div className="mt-4 w-full max-w-lg">
        <NavLinks />
      </div>
    </div>
  );
}
