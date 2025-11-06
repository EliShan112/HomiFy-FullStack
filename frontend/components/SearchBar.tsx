"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to hold the search query
  const [searchTerm, setSearchTerm] = useState("");

  // Sync the search bar with the URL query (/search?q=Paris)
  // This also clears the bar when navigate away.
  useEffect(() => {
    // Only on the search page, keep the term. Otherwise, clear it.
    if (pathname === "/listing/search") {
      setSearchTerm(searchParams.get("q") || "");
    } else {
      setSearchTerm("");
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // NO seach if empty

    router.push(`/listing/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="flex items-center rounded-full px-4 py-4 shadow-lg w-full max-w-lg"
    >
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
      <input
        type="text"
        placeholder="Search"
        aria-label="Search"
        className="ml-2 w-full outline-none border-none text-black font-bold"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="hidden">
        Search
      </button>
    </form>
  );
}
