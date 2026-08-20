import { useEffect, useState } from "react";
import axios from "axios";

import StatCard from "../components/StatCard";
import AuctionTable from "../components/AuctionTable";

import { useAuction } from "../context/AuctionContex";
import baseUrl from "../helpers/baseUrl";
import { toastError } from "../helpers/toastify";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalAuction: 0,
    upcoming: 0,
    live: 0,
    ended: 0,
  });

  const { auctions, setAuctions } = useAuction();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${baseUrl}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(response.data);
    } catch (error) {
      console.log(error);

      toastError(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchAuctions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${baseUrl}/admin/auctions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuctions(response.data);
    } catch (error) {
      console.log(error);

      toastError(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAuctions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <p className="mt-1 text-sm text-gray-500">
        Overview of your auction activity
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Auctions" value={dashboard.totalAuction} />

        <StatCard title="Upcoming" value={dashboard.upcoming} />

        <StatCard title="Live" value={dashboard.live} />

        <StatCard title="Ended" value={dashboard.ended} />
      </div>

      <AuctionTable auctions={auctions} />
    </div>
  );
}
