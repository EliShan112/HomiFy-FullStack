"use client";

import { Listing } from "@/types/listing";
import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { useProtectedApi } from "@/hooks/useProtectedApi";

export default function ListingPage() {
  const api = useProtectedApi();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get(`/listing`);
        setListings(res.data);
      } catch (err) {
        console.log("Listing error", err);
      }
    };
    fetchListings();
  }, []);

  if (!listings) return <p>Loading...</p>;

  return (
    <div className="w-full overflow-x-hidden">
      <h3 className="text-2xl p-4 text-center text-blue-500 font-bold">
        Homify Your Hotel!!
      </h3>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
