import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL, { baseURL } from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/web-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home" ,
            "/product" ,
            "/add-product" ,
            "/add-purchase" ,
            "/add-purchase-tiles" ,
            "/edit-purchase-tiles" ,
            "/view-purchase" ,
            "/edit-product" ,
            "/add-estimate" ,
            "/view-estimate" ,
            "/edit-purchase" ,
            "/estimate-list" ,
            "/sale-list",
            "/add-sales" ,
            "/add-esales" ,
            "/edit-sales" ,
            "/view-sales",
            "/purchase-tiles-list" ,
            "/purchase-granite-list" ,
            "/view-purchase-tiles" ,
            "/stock-form" ,
            "/stock-report" ,
            "/table" ,
            "/add-daybook" ,
            "/edit-daybook" ,
            "/daybook-report" ,
            "/ledger" ,
            "/ledgerReport" ,
            "/trialBalance" ,
            "/trialBalanceReport" ,
            "/profile" ,
            "/change-password",
        ];
        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password"
        ) {
          navigate(currentPath);
        } else {
          navigate("/");
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
