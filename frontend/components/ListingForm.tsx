'use client';
import React from 'react'

interface ListingFormProps {
        form:{
            title: string;
            description: string;
            image: {
              url: string;
            };
            price: string | number;
            country: string;
            location: string;
        }
        
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (e: React.FormEvent) => void;
        buttonText: string;
    }

const ListingForm: React.FC<ListingFormProps> = ({form, handleChange, handleSubmit, buttonText}) => {
    
  return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black ">
    <div className="relative w-full">
      <input
        type="text"
        name="title"
        id='title'
        value={form.title}
        onChange={handleChange}
        placeholder=" "
        required
        className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
  <label
    htmlFor="title"
    className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.title 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
  >
    Title
  </label>
</div>

    <div className="relative w-full">
    <input
      type="text"
      name="description"
      id='description'
      placeholder=" "
      value={form.description}
      onChange={handleChange}
      className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
      <label
        htmlFor="description"
        className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.description 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
      >
        Description
      </label>
  </div>

    <div className="relative w-full"> 
    <input
      key="image-url-input"
      type="text"
      name="image"
      id='image'  
      placeholder=" "
      value={form.image.url || ""}
      onChange={handleChange}
      className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <label
        htmlFor="image"
        className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.image.url 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
      >
        Enter image URL/Link
      </label>
  </div>

    <div className="relative w-full">
    <input
      type="number"
      name="price"
      id='price'
      placeholder=" "
      value={form.price}
      onChange={handleChange}
      className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <label
        htmlFor="price"
        className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.price 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
      >
        Enter price
      </label>
  </div>

    <div className="relative w-full">
    <input
      type="text"
      name="country"
      id='country'
      placeholder=" "
      value={form.country}
      onChange={handleChange}
      className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
    <label
        htmlFor="country"
        className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.country 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
      >
        Enter country
      </label>
  </div>

    <div className="relative w-full">
    <input
      type="text"
      name="location"
      id='location'
      placeholder=" "
      value={form.location}
      onChange={handleChange}
      className="peer block w-full border border-gray-300 rounded-md px-4 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required  
    />
    <label
        htmlFor="location"
        className={`absolute left-4 text-gray-500 transition-all cursor-text
    ${form.location 
      ? "top-0 text-sm text-blue-500" 
      : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"}
  `}
      >
        Enter location
      </label>
  </div>
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-semibold py-2 px-4 rounded-md shadow-md transition"
    >
      {buttonText}
    </button>
  </form>
  )
}

export default ListingForm  