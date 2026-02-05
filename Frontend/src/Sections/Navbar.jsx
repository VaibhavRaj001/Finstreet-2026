import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();

  return (
    <div className="mx-auto my-4 px-6 py-2 max-w-7xl">
      <div
        className="
        p-2
        px-4
        flex items-center justify-between
        border border-white/25
        rounded-[10px]
        bg-linear-to-r from-white/5 via-white/20 to-white/5
        backdrop-blur-lg
        shadow-xl
        text-xs
        text-amber-100
      "
      >
        {/* Logo */}
        <Link to="/" className="cursor-pointer">
          <img src="/FCLogo.png" alt="Club_Logo" className="h-8 w-auto" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4 md:gap-8 whitespace-nowrap">
          <Link
            to="/"
            className="
              cursor-pointer
              px-3 py-1
              rounded-lg
              transition-all duration-200 ease-in-out
              hover:scale-105
              hover:bg-[#474028]
              hover:ring-2 hover:ring-[#4C3C0C]
            "
          >
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-teams"
              className="
                cursor-pointer
                px-3 py-1
                rounded-lg
                transition-all duration-200 ease-in-out
                hover:scale-105
                hover:bg-[#474028]
                hover:ring-2 hover:ring-[#4C3C0C]
              "
            >
              My Teams
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="
                cursor-pointer
                px-3 py-1
                rounded-lg
                transition-all duration-200 ease-in-out
                hover:scale-105
                hover:bg-[#474028]
                hover:ring-2 hover:ring-[#4C3C0C]
                text-amber-400
              "
            >
              Admin
            </Link>
          )}

          {loading ? (
            <div className="px-5 py-1 text-white/50">Loading...</div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-white/60 hidden md:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="
                  px-4 py-1
                  rounded-[5px]
                  bg-red-500/20
                  border border-red-500/30
                  text-red-400
                  transition-all duration-200
                  hover:bg-red-500/30
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="
              px-5 py-1
              rounded-[5px]
              bg-[#474028]
              border border-[#886F1C]
              transition-all duration-200
              hover:bg-[#5a5234]
            "
            >
              JOIN US
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
