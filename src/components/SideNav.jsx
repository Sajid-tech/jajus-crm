import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import logo from "../assets/images/logo.png";
import { FaBook } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdCurrencyRupee, MdOutlineStickyNote2 } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoFileTrayFull } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";

const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-blue-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // close sidebar when clicking outside

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4 scroll-auto">
        <ul className="mb-4 flex flex-col gap-1">
          {localStorage.getItem("user_type_id") == "1"  && 
            <li>
              <NavLink to="/estimate-list">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <MdOutlineStickyNote2 className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Estimate
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
}
{((localStorage.getItem("user_type_id") == "2") || (localStorage.getItem("user_type_id") == "3") ) &&        
             (
              <>
               
              <li>
                <NavLink to="/home">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <HomeIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Dashboard
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink to="/daybook-report">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <FaBook className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Day Book
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/ledger">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <TableCellsIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Ledger
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/trialBalance">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <IoFileTrayFull className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Trail Balance
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              </>
             )}

              {localStorage.getItem("user_type_id") == "4"  && (
                <>
               
              <li>
                <NavLink to="/product">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <AiFillProduct className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Product
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/estimate-list">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <MdOutlineStickyNote2 className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Estimate
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/purchase-granite-list">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <FaCartShopping className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Purchase Granite
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/purchase-tiles-list">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <FaCartShopping className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Purchase Tiles
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/sale-list">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <MdCurrencyRupee className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Sales
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/stock-form">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="white"
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <BsGraphUpArrow className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Stocks
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
           
              </>
              )
              
              }
          {/* Add more hardcoded routes here as needed */}
        </ul>
         <div className="absolute bottom-4 left-0 right-0 text-center">
          <Typography variant="small" color="white" className="opacity-50">
            Updated on 14/06/2025
          </Typography>
        </div>
      </div>
    </aside>
  );
};
export default SideNav;
