"use client";
import ListingForm from "@/components/ListingForm";
import MessageFlash from "@/components/MessageFlash";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useProtectedApi } from "@/hooks/useProtectedApi";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export interface IFormState {
  title: string;
  description: string;
  price: string;
  country: string;
  location: string;
}

const New = () => {
  const router = useRouter();

  const [form, setForm] = useState<IFormState>({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
  });

  const [newImageFile, setnewImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(false);
  const { messageFlash, setMessageFlash } = useFlashMessage(3000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && name === "image") {
      // This handles ONLY file inputs
      if (files && files.length > 0) {
        const file = files[0];
        setnewImageFile(file);
        setImageUrlPreview(URL.createObjectURL(file));
      }
    } else {
      //bThis handles text
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const api = useProtectedApi();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // A new formdata object
    const formData = new FormData();

    //Appending text field in it
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("country", form.country);
    formData.append("location", form.location);

    //Appending the file
    if (newImageFile) {
      formData.append("image", newImageFile);
    } else {
      console.error("No file selected");
      setMessageFlash({ type: "error", text: "Please upload an image" });
      return;
    }

    try {
      await api.post(`/listing/new`, formData, {
        withCredentials: true,
      });
      setMessageFlash({
        type: "success",
        text: "Sucessfully created a new Listing",
      });
      router.push(redirectTo);
    } catch (err) {
      if (axios.isAxiosError(err) && err.message) {
        setMessageFlash({ type: "error", text: err.response?.data.message });
      }
      console.log("Couldn't send post request", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8  rounded-xl shadow-lg">
      {messageFlash && (
        <MessageFlash type={messageFlash.type} text={messageFlash.text} />
      )}
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Create a New Listing
      </h2>
      <ListingForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Uploading..." : "Add new listing"}
        imageUrlPreview={imageUrlPreview}
      />
    </div>
  );
};

export default New;
