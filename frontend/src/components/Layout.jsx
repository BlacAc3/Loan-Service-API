import { Link, Links, Outlet } from "react-router-dom";
import hamburger from "../assets/hamburger.svg";
import { useState } from "react";
import useAuth from "../context/useAuth.jsx";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const Navbar = ({ isAuthenticated }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-screen z-50 bg-black bg-opacity-80 transition-colors duration-300">
      <div className="w-screen h-fit px-6 py-4 border-b border-b-slate-300 flex items-center justify-between backdrop-blur-md">
        <div className="text-white flex items-center gap-4">
          <button
            className="md:hidden w-5 h-5 flex items-center justify-center"
            onClick={toggleSideMenu}
            aria-label="Toggle menu"
          >
            <img className="w-5 h-5" alt="hamburger-icon" src={hamburger} />
          </button>
          <Link to="/" className="text-white text-2xl font-bold">
            ZLoan
          </Link>
        </div>

        {/* Desktop navigation */}
        <ul className="hidden md:flex space-x-6">
          {!isAuthenticated && (
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <li>
              <Link
                to={"/dashboard"}
                className="text-white hover:text-gray-300"
              >
                Dashboard
              </Link>
            </li>
          )}
          <li>
            <a href="#" className="text-white hover:text-gray-300">
              Contact
            </a>
          </li>
          {isAuthenticated ? (
            <li>
              <Link
                to={"/logout"}
                className="text-white cursor-pointer hover:text-gray-300"
              >
                Logout
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile side menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-95 transform ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-white text-2xl font-bold">
              ZLoan
            </Link>
            <button
              onClick={toggleSideMenu}
              className="text-white text-2xl"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          <ul className="space-y-4">
            {!isAuthenticated && (
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-gray-300 block py-2"
                  onClick={toggleSideMenu}
                >
                  Home
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <li>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-gray-300 block py-2"
                  onClick={toggleSideMenu}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <a
                href="#"
                className="text-white hover:text-gray-300 block py-2"
                onClick={toggleSideMenu}
              >
                Contact
              </a>
            </li>
            {isAuthenticated ? (
              <li>
                <Link
                  to={"/logout"}
                  className="text-white cursor-pointer hover:text-gray-300 block py-2"
                  onClick={toggleSideMenu}
                >
                  Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-300 block py-2"
                  onClick={toggleSideMenu}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSideMenu}
        />
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="text-white p-4 bg-black">
      <ul className="flex flex-row gap-6 flex-wrap">
        <li className="space-y-4 md:w-1/4">
          <h1 className="text-xl font-bold">ZLoan</h1>
          <p className="text-gray-500">
            Providing accessible and affordable loan solutions to help you
            achieve your financial goals. Built by{" "}
            <a
              className="text-orange-600"
              href="https://blacac3-portfolio.vercel.app"
            >
              BlacAc3
            </a>
          </p>
          <div className="space-x-4 text-orange-600">
            <a href="https://github.com/blacac3" target="_blank">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://blacac3-portfolio.vercel.app" target="_blank">
              <i className="far fa-user"></i>
            </a>
          </div>
        </li>
      </ul>
    </footer>
  );
};

export default Layout;
