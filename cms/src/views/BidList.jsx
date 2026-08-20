import { useEffect, useState } from "react";
import axios from "axios";

import baseUrl from "../helpers/baseUrl";
import { toastError } from "../helpers/toastify";

export default function BidList() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchBids();
  }, []);

  async function fetchBids() {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${baseUrl}/admin/bids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBids(response.data);
    } catch (error) {
      console.log(error);

      toastError(error.response?.data?.message || "Failed to get bid data");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bid List</h1>

        <p className="mt-1 text-gray-500">View all auction bids</p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  No.
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Auction
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Bidder
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Bid Amount
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Bid Time
                </th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index) => (
                <tr key={bid.id} className="border-b last:border-0">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {bid.Product?.name || `Auction #${bid.product_id}`}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bid.User?.name || "-"}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    Rp {Number(bid.amount).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(bid.createdAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bids.length === 0 && (
            <div className="py-10 text-center text-gray-500">No bids found</div>
          )}
        </div>
      </div>
    </div>
  );
}
