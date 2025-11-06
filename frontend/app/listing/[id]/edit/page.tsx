"use client";
import ListingForm from "@/components/ListingForm";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProtectedApi } from "@/hooks/useProtectedApi";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { IFormState } from "../../new/page";
import MessageFlash from "@/components/MessageFlash";

const edit = () => {
  const router = useRouter();
  const { id } = useParams();
  const api = useProtectedApi();
  const { messageFlash, setMessageFlash } = useFlashMessage(3000);

  const [form, setForm] = useState<IFormState>({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [existingImageFile, setExistingImageFile] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/listing/${id}`);
        const { image, ...textData } = res.data;

        setForm(textData);
        setExistingImageFile(image.url);
      } catch (err) {
        console.log("Couldn't fetch the data", err);
        setMessageFlash({ type: "error", text: "Failed to load listing" });
      }
    };

    if (id) fetchingData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && name === "image") {
      if (files && files.length > 0) {
        setNewImageFile(files[0]);
        setExistingImageFile(URL.createObjectURL(files[0]));
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("country", form.country);
    formData.append("location", form.location);

    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    try {
      await api.put(`http://localhost:4000/listing/${id}`, formData, {
        withCredentials: true,
      });

      setMessageFlash({
        type: "success",
        text: "Listing updated successfully!!!",
      });

      router.push(`/listing/${id}`);
    } catch (err) {
      console.log("Couldn't put the request", err);
      if (axios.isAxiosError(err) && err.response) {
        setMessageFlash({ type: "error", text: err.response.data.message });
      } else {
        setMessageFlash({ type: "error", text: "An unknown error occured" });
      }
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8  rounded-xl shadow-lg">
      {messageFlash && (
        <MessageFlash type={messageFlash?.type} text={messageFlash?.text} />
      )}
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Editing...
      </h2>
      <ListingForm
        form={form}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        buttonText={loading ? 'Editing...' : 'Edit'}
        imageUrlPreview={existingImageFile}
      />
    </div>
  );
};

export default edit;
