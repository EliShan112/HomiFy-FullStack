'use client';

import React from 'react'

interface MessageProps {
    type? : "success" | "error" | "info";
    text: string;
}

const MessageFlash: React.FC<MessageProps> = ({type = "info", text}) => {

    const colors = {
        success: "bg-green-100 text-green-700 border-green-400",
        error: "bg-red-100 text-red-700 border-red-400",
        info: "bg-blue-100 text-blue-700 border-blue-400",
    }
  return (
    <div className={`border px-4 py-2 rounded-md text-sm ${colors[type]}`}>
        {text}
    </div>
  )
}

export default MessageFlash