'use client';

import MessageFlash from '@/components/MessageFlash';
import { useAuth } from '@/context/authContext';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useProtectedApi } from '@/hooks/useProtectedApi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface SignupFormData {
    email: string;
    username: string;
    password: string;
}

const page = () => {

    const router = useRouter();
    const api = useProtectedApi();
    const [form, setForm] = useState<SignupFormData>({
        email: "",
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const {messageFlash, setMessageFlash} = useFlashMessage(3000)
    const {setUser} = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/signup", form, {withCredentials:true});

            setUser(res.data.user)

            setMessageFlash({ type: 'success', text: 'Successfully signed up! You can login now!' });


            setForm({
                email: "",
                username: "", 
                password: ""
            });

            router.push('/listing');

        } catch (err) {
            if(axios.isAxiosError(err)){
                const backendMessage = err.response?.data?.message;
                setMessageFlash({type: "error", text: backendMessage || "Sign Up failed. Please try again"});
            } else{
                console.error("Unexpected error occured", err)
                setMessageFlash({type: "error", text: "Something went wrong. Please try again."})
            }
        }finally{
            setLoading(false);
        }
    }


  return (
    <div className='max-w-lg mx-auto mt-10 p-8  rounded-xl shadow-lg'>
        
        {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text}/>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign Up
        </h1>

        <div className="relative w-full">
            <input
                type="text"
                name="email"
                id='email'
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        <label
            htmlFor="email"
            className={`absolute left-4 text-gray-500 transition-all cursor-text
            ${form.email 
            ? "top-0 text-sm text-blue-500" 
            : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
        `}
        >
            Email
        </label>
        </div>


        <div className="relative w-full">
            <input
                type="username"
                name="username"
                id='username'
                value={form.username}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        <label
            htmlFor="username"
            className={`absolute left-4 text-gray-500 transition-all cursor-text
            ${form.username 
            ? "top-0 text-sm text-blue-500" 
            : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
        `}
        >
            Username
        </label>
        </div>


        <div className="relative w-full">
            <input
                type="password"
                name="password"
                id='password'
                value={form.password}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        <label
            htmlFor="password"
            className={`absolute left-4 text-gray-500 transition-all cursor-text
            ${form.password 
            ? "top-0 text-sm text-blue-500" 
            : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
        `}
        >
            Password
        </label>
        </div>

        <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-semibold py-2 px-4 rounded-md shadow-md transition"
    >
      {loading ? 'Signing Up...' : 'Sign Up'}
    </button>

        </form>
        
    </div>
  )
}

export default page