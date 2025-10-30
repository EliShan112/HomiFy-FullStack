'use client'
import axios from 'axios';
import { Listing } from '@/types/listing';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const listing = () => {

    

    const [listings, setListings] = useState<Listing[]>([]); 

    useEffect(()=>{
        const fetchListings = async () =>{
            try {
                const res = await axios.get("http://localhost:4000/listing")
                setListings(res.data)
            } catch (err) {
                console.log("Listing error", err)
            }
        }
        fetchListings();
    },[])

    if(!listings) return <p>Loading...</p>
  return (
    <div className=' w-full   overflow-x-hidden'>
  <h3 className='text-2xl p-4 text-center text-blue-400 font-bold'>All listings</h3>
  <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
    {listings.map((listing) => (
      <Link key={listing._id} href={`/listing/${listing._id}`} className="border rounded-xl shadow-sm hover:shadow-lg transition p-3 text-center">
        <div className='relative w-full rounded-lg h-48 overflow-hidden'>
          <Image src={listing.image.url} alt={listing.title || "Listing image"} className='object-cover' fill />
        </div>
        <div className='mt-3'>
          <h4 className='font-semibold text-lg truncate'>{listing.title || "No title"}</h4>
          <p className='text-gray-700 text-sm'>{listing.description ? listing.description.slice(0,60).concat("...") : "No description"}</p>
        </div>
      </Link>
    ))}
  </div>
</div>

  )
}

export default listing