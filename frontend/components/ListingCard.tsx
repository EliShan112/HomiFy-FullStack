"use client";

import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing._id}`}
      className="border rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition p-3 text-center bg-white"
    >
      <div className="relative w-full rounded-lg h-48 overflow-hidden">
        <Image
          src={listing.image.url}
          alt={listing.title || "Listing image"}
          className="object-cover"
          fill
        />
      </div>

      <div className="mt-3 space-y-1">
        <h4 className="font-semibold text-lg truncate">
          {listing.title || "No title"}
        </h4>
        <p className="text-gray-600 text-sm">
          {listing.description
            ? listing.description.slice(0, 60).concat("...")
            : "No description"}
        </p>
      </div>
    </Link>
  );
}
