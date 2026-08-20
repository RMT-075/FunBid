import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toastify";

export default function AuctionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [auction, setAuction] = useState(null);

  useEffect(() => {
    fetchAuction();
  }, []);

  async function fetchAuction() {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${baseUrl}/admin/auctions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuction(response.data);
    } catch (error) {
      console.log(error);

      toastError(
        error.response?.data?.message || "Failed to get auction detail",
      );
    }
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`${baseUrl}/admin/auctions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toastSuccess("Auction deleted successfully");

      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);

      toastError(error.response?.data?.message || "Failed to delete auction");
    }
  }

  if (!auction) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Auction Detail</h1>

          <p className="mt-1 text-gray-500">View auction information</p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer"
        >
          Back
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="grid md:grid-cols-2">
          <div>
            <img
              src={auction.image_url}
              alt={auction.name}
              className="h-full min-h-80 w-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="mb-4">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {auction.status}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">{auction.name}</h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              {auction.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Starting Price</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  Rp {Number(auction.starting_price).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Price</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  Rp {Number(auction.current_price).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Bid Increment</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  Rp {Number(auction.bid_increment).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Winner</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  {auction.winner_id ? `User #${auction.winner_id}` : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Start Time</p>

                <p className="mt-1 font-medium text-gray-800">
                  {new Date(auction.start_time).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">End Time</p>

                <p className="mt-1 font-medium text-gray-800">
                  {new Date(auction.end_time).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t pt-6">
              <button
                onClick={() => navigate(`/admin/auctions/${auction.id}/edit`)}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 cursor-pointer"
              >
                Edit Auction
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white hover:bg-red-600 cursor-pointer"
              >
                Delete Auction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
