import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/admin/login");
  };

  return (
    <nav className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-bold">Auction CMS</h1>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-4 py-2 text-white cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
