import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SocketProvider from "./SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);
