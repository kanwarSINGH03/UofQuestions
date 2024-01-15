import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const signIn = async (inputs) => {

    const res = await axios.post("http://localhost:8080/backend/authent/signIn",inputs,{

    withCredentials: true,
    });

    setCurrentUser(res.data)
    
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, signIn}}>
      {children}
    </AuthContext.Provider>
  );
};
