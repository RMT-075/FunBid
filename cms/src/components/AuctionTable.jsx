import { Link } from "react-router";

export default function AuctionTable({ auctions }) {
  return (
    <div className="mt-10 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Auction List</h2>

        <Link
          to="/admin/add-auction"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          + Add Auction
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Starting Price</th>
              <th className="px-4 py-3">Current Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.id} className="border-b text-sm text-gray-700">
                <td className="px-4 py-3">
                  <img
                    src={auction.image_url}
                    alt={auction.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-medium">{auction.name}</td>

                <td className="px-4 py-3">
                  Rp {Number(auction.starting_price).toLocaleString("id-ID")}
                </td>

                <td className="px-4 py-3">
                  Rp {Number(auction.current_price).toLocaleString("id-ID")}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                    {auction.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/auctions/${auction.id}`}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium"
                    >
                      Detail
                    </Link>

                    <Link
                      to={`/admin/auctions/${auction.id}/edit`}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {auctions.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          No auctions found
        </p>
      )}
    </div>
  );
}
