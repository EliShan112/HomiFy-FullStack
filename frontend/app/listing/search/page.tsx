"use client";

import ListingCard from "@/components/ListingCard";
import { useProtectedApi } from "@/hooks/useProtectedApi";
import { Listing } from "@/types/listing";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Search = () => {
  const api = useProtectedApi();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(
          `/listing/search?q=${encodeURIComponent(query)}`
        );
        setListings(res.data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Could not load search results.");
      }finally{
        setLoading(false);
      }
    };
    fetchListing();
  }, [query, api]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          Searching for: &quot;{query}&quot;
        </h2>
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Showing results for: &quot;{query}&quot;
      </h2>
      {listings.length === 0 ? (
        <p>No listings found for this location.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing)=>(
                <ListingCard key={listing._id} listing={listing}/>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
