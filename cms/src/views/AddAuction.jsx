import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import baseUrl from "../helpers/baseUrl";
import { toastSuccess, toastError } from "../helpers/toastify";

export default function AddAuction() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    starting_price: "",
    bid_increment: "",
    start_time: "",
    end_time: "",
    status: "upcoming",
    image: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({
        ...form,
        image: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("starting_price", form.starting_price);
      formData.append("bid_increment", form.bid_increment);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);
      formData.append("status", form.status);
      formData.append("image", form.image);

      await axios.post(
        `${baseUrl}/admin/auctions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toastSuccess("Auction created successfully");

      navigate("/admin/dashboard");
    } catch (error) {
      toastError(
        error.response?.data?.message ||
        "Failed to create auction"
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Add Auction
        </h1>

        <p className="mt-1 text-gray-500">
          Create a new auction item
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <div className="grid gap-5">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Auction Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter auction name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Starting Price
              </label>

              <input
                type="number"
                name="starting_price"
                value={form.starting_price}
                onChange={handleChange}
                placeholder="Enter starting price"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Bid Increment
              </label>

              <input
                type="number"
                name="bid_increment"
                value={form.bid_increment}
                onChange={handleChange}
                placeholder="Enter bid increment"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Start Time
              </label>

              <input
                type="datetime-local"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                End Time
              </label>

              <input
                type="datetime-local"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Auction Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 cursor-pointer"
            >
              Create Auction
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}