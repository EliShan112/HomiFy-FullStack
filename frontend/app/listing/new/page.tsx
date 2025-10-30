'use client';
import ListingForm from '@/components/ListingForm';
import MessageFlash from '@/components/MessageFlash';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useProtectedApi } from '@/hooks/useProtectedApi';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {

    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: {
            url: ""
        },
        price: "",
        country: "",
        location: ""
    });

      const {messageFlash, setMessageFlash} = useFlashMessage(3000);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'image') {
            setForm((prevForm) => ({
            ...prevForm,
            image: {
                ...prevForm.image,
                url: value,
            },
            }));
        } else {
            setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
            }));
        }
    };

    const api = useProtectedApi();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";


    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
            await api.post("http://localhost:4000/listing/new", form, {withCredentials: true});
            setMessageFlash({type: 'success', text:'Sucessfully created a new Listing'});
            router.push(redirectTo)
        } catch (err) {

            if(axios.isAxiosError(err) && err.message){
                setMessageFlash({type: 'error', text: err.response?.data.message})
            }
            console.log("Couldn't send post request", err);
        }
    }

    
  return (
    <div className="max-w-lg mx-auto mt-10 p-8  rounded-xl shadow-lg">
        {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text}/>}
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create a New Listing</h2>
      <ListingForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} buttonText='Add new listing'/>
</div>

  )
}

export default page