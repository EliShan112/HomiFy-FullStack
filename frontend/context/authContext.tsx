'use client';

import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type User = { _id: string; username: string; email?: string } | null;

interface AuthContextType {
    user: User;
    setUser: (u: User) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
      const checkAuth = async () => {
        try {
          const res = await axios.get('http://localhost:4000/check-auth', {withCredentials: true});
          if(res.data.isAuthenticated){
            setUser(res.data.user)
          }
        } catch (err) {
          console.error('Auth check failed:', err);
        } finally{
          setLoading(false);
        }
      }

      checkAuth();
      
    },[]);

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
