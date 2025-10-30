'use client';
import ListingForm from '@/components/ListingForm';
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const edit = () => {

    const router = useRouter();
    const {id} = useParams();
    
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



    useEffect(()=>{
        const fetchingData = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/listing/${id}`)
                setForm(res.data);
            } catch (err) {
                console.log("Couldn't fetch the data", err);
            }
        }
        
        if(id) fetchingData();
    },[id]);

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

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
                const cleanForm = {
                    title: form.title,
                    description: form.description,
                    image: form.image,
                    price: Number(form.price),
                    location: form.location,
                    country: form.country,
                };

            await axios.put(`http://localhost:4000/listing/${id}`, cleanForm, {withCredentials: true});
            router.push(`/listing/${id}`);
        } catch (err) {
            console.log("Couldn't put the request", err);
        }
    }


  return (
    <div className="max-w-lg mx-auto mt-10 p-8  rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Editing...</h2>
        <ListingForm form={form} handleSubmit={handleSubmit} handleChange={handleChange} buttonText='Edit'/>
</div>
  )
}

export default edit