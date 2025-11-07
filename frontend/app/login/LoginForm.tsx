'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import MessageFlash from '@/components/MessageFlash';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useAuth } from '@/context/authContext';
import { useProtectedApi } from '@/hooks/useProtectedApi';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useProtectedApi();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const {messageFlash, setMessageFlash} = useFlashMessage(3000);
  const { setUser } = useAuth();
  
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', form, { withCredentials: true });

      if (!res?.data?.user) {
        setMessageFlash({ type: 'error', text: "Couldn't get user data" });
        return;
      }

      setUser(res.data.user);
      setMessageFlash({ type: 'success', text: "Successfully logged in" });

      const redirectTo = searchParams.get('redirectTo');
      router.push(redirectTo || '/listing');

    } catch (err) {
      let msg = "Got some error during login";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.response?.data?.error || msg;
      }

      setMessageFlash({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 p-8 rounded-xl shadow-lg'>
      {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text}/>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Log In
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
            type="text"
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
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm;