import React, { useState, useContext, useRef, useEffect } from "react";
import { Button } from "antd";
import {
  HeartOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Context from "../util/context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { session, setSession } = useContext(Context);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setSession(null);
    setProfileOpen(false);
  };

  const getDashboardLink = (role) => {
    switch (role) {
      case "patient":
        return "/patient/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-white via-red-50 to-white border-b border-gray-100">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
            <HeartOutlined className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            CareSync
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10 font-medium text-gray-700">
          {["home", "services", "doctors", "appointments", "patients", "departments", "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="relative hover:text-red-500 transition group capitalize"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-red-500 to-pink-500 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 h-10 bg-white hover:border-rose-400 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <UserOutlined className="text-white text-xs" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {session.email}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                      <UserOutlined className="text-white text-base" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm truncate">{session.email}</p>
                      <span className="text-white/80 text-xs capitalize bg-white/20 px-2 py-0.5 rounded-full">
                        {session.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-2">
                    <a
                      href={getDashboardLink(session.role)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 text-sm font-medium transition"
                    >
                      <UserOutlined />
                      Go to Dashboard
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 text-sm font-medium transition"
                    >
                      <LogoutOutlined />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
             <Link to="/login">
  <Button className="rounded-lg border !border-gray-200 h-10 px-6 bg-white !hover:border-rose-500 text-rose-500">
    Login
  </Button>
</Link>

              <Button
                type="primary"
                className="!bg-gradient-to-r from-red-500 to-pink-500 !border-none rounded-lg h-10 px-7 font-semibold !hover:scale-105 transition"
              >
                Book Appointment
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          {open ? (
            <CloseOutlined className="text-2xl text-gray-700 cursor-pointer" onClick={() => setOpen(false)} />
          ) : (
            <MenuOutlined className="text-2xl text-gray-700 cursor-pointer" onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-white to-red-50 px-6 pb-6">
          <nav className="flex flex-col gap-5 font-medium text-gray-700">

            {["home", "services", "doctors", "appointments", "patients", "departments", "contact"].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setOpen(false)} className="capitalize hover:text-red-500">
                {item}
              </a>
            ))}

            {session ? (
              <>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl px-4 py-3 flex items-center gap-3 mt-2">
                  <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
                    <UserOutlined className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold truncate">{session.email}</p>
                    <span className="text-white/80 text-xs capitalize">{session.role}</span>
                  </div>
                </div>

                <a href={getDashboardLink(session.role)} onClick={() => setOpen(false)}>
                  <Button
                    type="primary"
                    className="!bg-gradient-to-r from-red-500 to-pink-500 border-none rounded-lg h-10 w-full"
                  >
                    Go to Dashboard
                  </Button>
                </a>

                <Button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="rounded-lg border border-gray-200 h-10 bg-white w-full text-rose-500"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button className="rounded-lg border border-gray-200 mt-3 h-10 bg-white">
                  Login
                </Button>

                <Button
                  type="primary"
                  className="!bg-gradient-to-r from-red-500 to-pink-500 border-none rounded-lg h-10"
                >
                  Book Appointment
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;