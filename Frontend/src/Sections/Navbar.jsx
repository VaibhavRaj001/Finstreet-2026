import { Link } from "react-router-dom";
import { useState } from "react";
import ContactModal from "../Components/ContactModal";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const { isContactOpen, openContact, closeContact } = useModal();

  return (
    <div className="sticky top-0 z-50 mx-0 my-0 w-full rounded-none border px-4 py-2 md:text-xs  text-[10px] items-center bg-linear-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-lg border-white/25 shadow-xl md:static md:mx-10 md:my-4 md:w-auto md:rounded-[10px] md:px-4 md:py-2">
      <div className="flex justify-between items-center text-amber-100 ">
        <Link to="/" className="logo cursor-pointer">
          <img src="/FCLogo.png" alt="Club_Logo" className="lg:h-8 h-5" />
        </Link>
        <div className="flex lg:gap-15 gap-5 items-center cursor-pointer md:gap-8 whitespace-nowrap">
          <Link
            to="/"
            className="hover:bg-[#474028] hover:scale-110 hover:border-[2.5px] hover:p-[3.5px]  border-[#4C3C0C] transition-all duration-200 rounded-lg ease-in-out"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="hover:bg-[#474028] hover:scale-110 hover:border-[2.5px] hover:p-[3.5px]  border-[#4C3C0C] transition-all duration-200 rounded-lg ease-in-out"
          >
            Events
          </Link>

          <div
            onClick={openContact}
            className="flex gap-2 items-center p-2 hover:bg-[#474028] cursor-pointer border-[1.34px] rounded-[5px] border-[#4C3C0C]"
          >
            Contact
            <img
              src="/arrowDown.png"
              alt="Arrow_Down"
              className="h-1.0 w-2.0"
            />
          </div>

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
              <span className="text-white/60 hidden md:inline">
                {user?.name}
              </span>
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
              className="bg-[#474028] text-amber-100 rounded-[5px] py-1 px-5 cursor-pointer border border-[#886F1C] hover:scale-110 transition-all duration-200"
            >
              JOIN US
            </Link>
          )}
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
}

export default Navbar;
