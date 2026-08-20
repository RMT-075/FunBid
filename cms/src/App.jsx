import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./views/Login";
import BaseLayout from "./components/BaseLayout";
import Dashboard from "./views/Dashboard";
import AddAuction from "./views/AddAuction";
import BidList from "./views/BidList";
import EditAuction from "./views/EditAuction";
import AuctionDetail from "./views/AuctionDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<BaseLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add-auction" element={<AddAuction />} />
              <Route path="/admin/auctions/:id" element={<AuctionDetail />} />
              <Route path="/admin/auctions/:id/edit" element={<EditAuction />}/>
              <Route path="/admin/bids" element={<BidList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
