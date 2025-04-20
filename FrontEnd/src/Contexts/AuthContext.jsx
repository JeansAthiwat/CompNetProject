import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("AuthContext user changed:", user);
  }, [user]);
  
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
