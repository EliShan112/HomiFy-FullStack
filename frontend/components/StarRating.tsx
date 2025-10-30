'use client';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { Review } from '@/types/review';
import axios from 'axios';
import React, { useState } from 'react'
import MessageFlash from './MessageFlash';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

interface StarRatingProps {
    listingId : string;
    onNewReview: (review: Review) => void;
}

const StarRating : React.FC<StarRatingProps> = ({listingId, onNewReview}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("")

    const {user} = useAuth()
    const {setMessageFlash, messageFlash} = useFlashMessage(3000);

    //textarea change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }

    //submit button
    const submitReview = async () => {
        try {
            const res = await axios.post(`http://localhost:4000/listing/${listingId}/review`, {rating, comment}, {withCredentials: true});
            const newReview: Review = res.data.review;
            onNewReview(newReview);
            setMessageFlash({type: 'success', text: "Thanks for the review!"});
            setRating(0);
            setComment('');
        } catch (err) {
            if(axios.isAxiosError(err) && err.response){
                setMessageFlash({type: "error", text: err.response.data.message});
            }
            console.log("Couldn't leave review", err);
        }
    }

  return (
    <div className='mt-6'>
        {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text}/>}
        <h3 className='text-3xl font-semiboldbold mb-2'>Leave a Rating</h3>
        <div className='flex space-x-1 mb-2'>
            {[1,2,3,4,5].map((star)=>(
            <span 
            key={star} 
            onClick={()=>setRating(star)}
            onMouseEnter={()=>setHover(star)}
            onMouseLeave={()=>setHover(0)}
            className={`cursor-pointer text-3xl transform transition-transform duration-200 hover:scale-130 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-400'}`}>★</span>
        ))}
        </div>

        {/* Hiding reviews if not logged in */}
        {user ? (
            <>
                <div className='mt-2'>
                    <h4 className='text-2xl font-semibold mb-1'>Comment</h4>
                    <textarea
                    value={comment}
                    onChange={handleChange}
                    placeholder="Write your review..."
                    className="w-full  mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button onClick={submitReview} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'>Submit</button>
            </>
        ): (
            <p>Please <Link href='/login'>login</Link> or <Link href='/signup'>sign up</Link> to leave a review</p>
            
        )}
        
    </div>
  )
}

export default StarRating