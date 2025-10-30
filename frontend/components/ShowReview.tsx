'use client';

import React from 'react';
import { Review } from '@/types/review';
import axios from 'axios';
import { FlashMessage } from '@/hooks/useFlashMessage';
import { useAuth } from '@/context/authContext';

interface ShowReviewProps {
  reviews: Review[];
  listingId: string;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
  setMessageFlash: React.Dispatch<React.SetStateAction<FlashMessage | null>>
}

const ShowReview: React.FC<ShowReviewProps> = ({ reviews, listingId, setReviews, setMessageFlash }) => {

  const {user, loading} = useAuth();

    const handleDelete = async (reviewId: string) => {
        try {
            await axios.delete(`http://localhost:4000/listing/${listingId}/review/${reviewId}`, {withCredentials: true})
            setReviews((prev)=>prev.filter((r)=> r._id !== reviewId))
            setMessageFlash({type:"success", text:"Successfully deleted the review!"})
        } catch (err) {
          if(axios.isAxiosError(err) && err.response){
            setMessageFlash({type:"error", text: err.response.data.message || "Some unkown error occured during deleting"})
          }
            console.error("Error deleting review", err);
        }
    }

    if(loading){
      <div className='mt-6'>
        <h4 className='text-2xl font-semibold mb-3'>Reviews</h4>
        <p>Loading...</p>
      </div>
    }

  return (
    <div className='mt-6'>
      <h4 className='text-2xl font-semibold mb-3'>Reviews</h4>

      {reviews.length > 0 ? (
        reviews.map((r) => (
          <div key={r._id} className='border-b border-gray-300 py-2 flex flex-col'>
            <h3 className='font-semibold'>{r.author?.username || 'unknown username'}</h3>
            <p className='text-yellow-500'>⭐ {r.rating}/5 star</p>
            <p>{r.comment}</p>
            <small className='text-gray-500'>
              {r.createdAt}
            </small>

            {/* Hiding edit delete if no authorised user */}
            {user && user._id.toString() === r.author?._id.toString() && (
              <button
                onClick={() => handleDelete(r._id)}
                className='mt-2 self-start px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition hover:cursor-pointer'
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p className='text-gray-500'>No reviews yet.</p>
      )}
    </div>
  );
};

export default ShowReview;
