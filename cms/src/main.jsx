import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuctionProvider } from "./context/AuctionContex.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuctionProvider>
      <App />
    </AuctionProvider>
  </StrictMode>,
);
