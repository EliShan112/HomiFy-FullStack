"use client";
import React, { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, HomeIcon, GlobeAltIcon, WrenchIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon  } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import MessageFlash from "./MessageFlash";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: "Listing", icon: <HomeIcon className="h-5 w-5" />, href: "/listing" },
    { name: "Add new list", icon: <GlobeAltIcon className="h-5 w-5" />, href: "/listing/new" },
    { name: "Services", icon: <WrenchIcon className="h-5 w-5" />, href: "#" },
  ];

  const activeIndex = links.findIndex(link => pathName === link.href)

  const {user, setUser} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const {messageFlash ,setMessageFlash} = useFlashMessage(3000);

  const logout = async () => {
    try {
      await axios.get('http://localhost:4000/logout', {withCredentials: true});
      setUser(null);
      setMessageFlash({ type: "success", text: "Logged out successfully" });

    } catch (err) {
      setMessageFlash({type: 'error', text: "Couldn't logout"});
    }
  }

  useEffect(()=>{
    const fetchUserAuth = async () => {
      try {
        const res = await axios.get('http://localhost:4000/check-auth', {withCredentials: true});
        if(res.data.isAuthenticated === true){
          setUser(res.data.user);
        } else{
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      }
    }

    fetchUserAuth();

    const handleAuthChange = () => fetchUserAuth();
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);

  },[setUser]);

  useEffect(()=>{
    const handleClickOutside = (e: MouseEvent) => {
      if(menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)){
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="w-[100vw] flex flex-col justify-center items-center p-4 rounded-2xl shadow-lg">

      {messageFlash && <MessageFlash type={messageFlash.type} text={messageFlash.text} />}

      {/* top row */}
      <div className="flex justify-between items-center w-full max-w-6xl">
        {/* Empty div to balance the layout */}
        <div className="w-20"></div>
        
        {/* Search Bar - Centered */}
        <div className="flex items-center justify-between rounded-full px-4 py-4 shadow-lg w-full max-w-lg">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 w-full outline-none border-none text-black font-bold"
          />
        </div>

        {/* Profile Section - Right aligned */}
        <div className="relative ml-6 text-center w-20">
          <button onClick={()=> setMenuOpen(!menuOpen)} 
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer">
            <UserCircleIcon className="h-7 w-7 text-gray-700" />
            <span className="font-semibold text-gray-700 hidden sm:block">Profile</span>
          </button>
          {menuOpen && (
            <div ref={menuRef} 
            className="absolute  mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50">
              {user? (
                <>
                  <button 
                    className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={()=> {
                      router.push('/profile')
                    setMenuOpen(false)

                      }}>
                      My Account
                  </button>

                  <button 
                  className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={()=> {
                    logout()
                    setUser(null)
                    setMenuOpen(false)
                    setMessageFlash({type: 'success', text: 'Successfully logged Out'})
                  }}
                  >

                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />

                    
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                  className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={()=> {
                    router.push('/login')
                    setMenuOpen(false)
                  }}>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                    Login
                  </button>

                  <button
                  className="flex gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={()=> {
                    router.push('/signup')
                    setMenuOpen(false)
                    }}>

                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                      
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <div className="relative flex justify-between w-full max-w-lg mt-4">
        {links.map((link, i) => (
          <Link href={link.href}
            key={i}
            className={`flex flex-col items-center w-20 transform transition-transform duration-200 cursor-pointer ${
              activeIndex === i ? "scale-110" : "hover:scale-90"
            }`}
          >
            {link.icon}
            <span className="text-sm">{link.name}</span>
          </Link>
        ))}

        {/* Underline Indicator */}
        {activeIndex !== -1 && (
          <div className="absolute bottom-[-10] left-0 w-full h-1">
          <div
            className="h-1 bg-black rounded-full transition-all duration-300"
            style={{
              width: `${50 / links.length}%`,
              transform: `translateX(${activeIndex * 250}%)`,
            }}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
