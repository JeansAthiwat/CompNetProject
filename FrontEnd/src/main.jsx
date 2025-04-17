import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SocketProvider from "./Contexts/SocketContext";
import AuthProvider from "./Contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
    </AuthProvider>
  </React.StrictMode>

);
