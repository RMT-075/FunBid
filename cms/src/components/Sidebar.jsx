import { NavLink, useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/admin/login");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Add Auction",
      path: "/admin/add-auction",
    },
    {
      name: "Bid List",
      path: "/admin/bids",
    },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 px-6 py-5">
        <h1 className="text-xl font-bold">Auction CMS</h1>

        <p className="mt-1 text-xs text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
