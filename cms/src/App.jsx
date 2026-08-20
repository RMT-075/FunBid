import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./views/Login";
import BaseLayout from "./components/BaseLayout";
import Dashboard from "./views/Dashboard";
import AddAuction from "./views/AddAuction";
import BidList from "./views/BidList";
import EditAuction from "./views/EditAuction";
import AuctionDetail from "./views/AuctionDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route element={<BaseLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-auction" element={<AddAuction />} />
            <Route path="/admin/auctions/:id" element={<AuctionDetail />} />
            <Route path="/admin/auctions/:id/edit" element={<EditAuction />} />
            <Route path="/admin/bids" element={<BidList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
