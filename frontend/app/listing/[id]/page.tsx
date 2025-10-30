'use client';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Listing } from '@/types/listing';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StarRating from '@/components/StarRating';
import ShowReview from '@/components/ShowReview';
import { Review } from '@/types/review';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import MessageFlash from '@/components/MessageFlash';
import { useAuth } from '@/context/authContext';

const page = () => {
    const {id} = useParams();
    const router = useRouter();
    const [listings, setListings] = useState<Listing | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const {user} = useAuth();

    const {messageFlash, setMessageFlash} = useFlashMessage(3000);
    useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch listing first
      const listingRes = await axios.get(`http://localhost:4000/listing/${id}`);
      console.log('Listing data:', listingRes.data);
      console.log('Reviews:', listingRes.data.review);
      setListings(listingRes.data);
      setReviews(listingRes.data.review || []);
    } catch (err) {
      console.error("Couldn't fetch listing", err);
      setListings(null);
    }
  };

  if (id) fetchData();
}, [id]);


    if(!listings) return <p>loading...</p>


    const handleDelete = async() =>{
        try {
            await axios.delete(`http://localhost:4000/listing/${id}`, {withCredentials: true});
            setMessageFlash({type: 'success', text: 'Sucessfully deleted!'});
            router.push('/listing');
        } catch (err) {
          if(axios.isAxiosError(err) && err.response){
            setMessageFlash({type: 'error', text: err.response.data.message || "Couldn't delete item"});
          }
        }
    }
    
  return (
    <div className='max-w-4xl mx-auto p-6'>
            <h3 className='text-3xl font-bold'>{listings.title || "Untitled Listing"}</h3>
        <div className='relative w-full h-[400px] rounded-xl shadow-md mt-3'>
            <Image src={listings.image.url} alt={listings.title || "No titled image"} fill className='object-cover'/>
        </div>
        <div className='mt-2 space-y-2'>
            <p className='text-black font-semibold'>Owned by: {listings.owner.username}</p>
            <p className='text-gray-700'>{listings.description}</p>
            <p className='text-gray-600'>{listings.location}</p>
            <p className='text-xl font-semibold text-green-700'>&#8377;{listings.price.toLocaleString("en-IN")}</p>
        </div>

          {/* Hiding if current user is not the owner of listing */}
          {user && listings?.owner && user._id?.toString() === listings.owner._id?.toString() && (
            <div className="flex gap-4 mt-6">
            <Link
              href={`/listing/${listings._id}/edit`}
              className="flex-1 text-center py-3 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
            >
              Delete
            </button>
          </div>
          )}

          {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text}/>}
        
      <hr className='mt-3' />
      <StarRating 
      listingId={id as string}
      onNewReview={(review)=> setReviews((prev)=>[...prev, review])}/>

      <hr className='mt-3' />
      <ShowReview listingId={id as string} reviews = {reviews} setReviews={setReviews} setMessageFlash={setMessageFlash}/>

    </div>
  )
}

export default page