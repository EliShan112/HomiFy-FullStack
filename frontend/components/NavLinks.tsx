"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GlobeAltIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Home", icon: HomeIcon, href: "/listing" },
  { name: "Create Stay", icon: GlobeAltIcon, href: "/listing/new" },
  { name: "Services", icon: WrenchIcon, href: "#" },
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  const activeIndex = links.findIndex((l) => l.href === pathname);

  return (
    <div className="relative flex justify-between">
      {links.map(({ name, icon: Icon, href }, i) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center w-20 transition-transform duration-200 ${
            activeIndex === i ? "scale-110" : "hover:scale-90"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm">{name}</span>
        </Link>
      ))}

      {/* Underline Indicator */}

        {activeIndex !== -1 && (

          <div className="absolute bottom-[-10] left-0 w-full h-1">

          <div

            className="h-1 bg-black rounded-full transition-all duration-300"

            style={{

              width: `${50 / links.length}%`,

              transform: `translateX(${activeIndex * 250}%)`,

            }}

          />
        </div>
      )}
    </div>
  );
}
