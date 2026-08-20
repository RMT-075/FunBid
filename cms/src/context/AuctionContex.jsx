import { createContext, useContext, useState } from "react";

const AuctionContext = createContext();

export function AuctionProvider({ children }) {
  const [auctions, setAuctions] = useState([]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        setAuctions,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  return useContext(AuctionContext);
}
