import { useEffect, useState } from "react";

export type FlashMessage = {
  type: "success" | "error";
  text: string;
};


export const useFlashMessage = (duration: number = 3000) => {
    const [messageFlash, setMessageFlash] = useState<FlashMessage|null>(null);

    useEffect(()=>{
        if(!messageFlash){
            return
        }

        const timer = setTimeout(()=>setMessageFlash(null), duration)
        return () => clearTimeout(timer);
    },[messageFlash, duration])

    return {messageFlash, setMessageFlash};
}
