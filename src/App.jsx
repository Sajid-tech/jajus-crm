import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import Registration from "./pages/dashboard/Registration";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import AdddayBook from "./pages/dashboard/Form/AdddayBook";
import EditdayBook from "./pages/dashboard/Form/editDayBook/EditdayBook";
import DayBookReports from "./pages/dashboard/Form/daybookreport/DayBookReports";
import Ledger from "./pages/dashboard/ledger/Ledger";
import LedgerReport from "./pages/dashboard/ledger/LedgerReport";
// import TrialBalance from "./pages/dashboard/trialBalance/trialBalance";
import TrialBalanceReport from "./pages/dashboard/trialBalance/TrialBalanceReport";
import TrialBalance from "./pages/dashboard/trialBalance/TrialBalance";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./pages/product/AddProduct";
import AddPurchase from "./pages/purchaseSale/AddPurchase";
import EditProduct from "./pages/product/EditProduct";
import AddPurchaseTiles from "./pages/purchaseSale/AddPurchaseTiles";
import EstimateList from "./pages/estimate/EstimateList";
import SaleList from "./pages/sale/SaleList";
import PurchaseSale from "./pages/purchaseSale/PurchaseSale";
import PurchaseGraniteList from "./pages/purchaseSale/PurchaseGraniteList";
// import ProductList from "./pages/product/ProductList";
import AddSales from "./pages/sale/AddSales";
import ProductList from "./pages/product/ProductList";
import AddEstimate from "./pages/estimate/AddEstimate";
import EditPurchase from "./pages/purchaseSale/EditPurchase";
import EditPurchaseTiles from "./pages/purchaseSale/EditPurchaseTiles";
import EditSales from "./pages/sale/EditSales";
import ViewSales from "./pages/sale/ViewSales";
import ViewEstimate from "./pages/estimate/ViewEstimate";
import ViewPurchase from "./pages/purchaseSale/ViewPurchase";
import AddESales from "./pages/sale/AddESales";
import ViewPurchaseTiles from "./pages/purchaseSale/ViewPurchaseTiles";
import StockForm from "./pages/stocks/StockForm";
import StockReport from "./pages/stocks/StockReport";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/product" element={<ProtectedRoute element={<ProductList />} />} />
        <Route path="/add-product" element={<ProtectedRoute element={<AddProduct />} />} />
        <Route path="/edit-product/:id" element={<ProtectedRoute element={<EditProduct />} />} />
        <Route path="/add-purchase" element={<ProtectedRoute element={<AddPurchase />} />} />
        <Route path="/edit-purchase/:id" element={<ProtectedRoute element={<EditPurchase />} />} />
        <Route path="/add-purchase-tiles" element={<ProtectedRoute element={<AddPurchaseTiles />} />} />
        <Route path="/edit-purchase-tiles/:id" element={<ProtectedRoute element={<EditPurchaseTiles />} />} />
        <Route path="/add-estimate" element={<ProtectedRoute element={<AddEstimate />} />} />
        <Route path="/estimate-list" element={<ProtectedRoute element={<EstimateList />} />} />
        <Route path="/view-estimate/:id" element={<ProtectedRoute element={<ViewEstimate />} />} />
        <Route path="/sale-list" element={<ProtectedRoute element={<SaleList />} />} />
        <Route path="/add-sales" element={<ProtectedRoute element={<AddSales />} />} />
        <Route path="/add-esales/:id" element={<ProtectedRoute element={<AddESales />} />} />
        <Route path="/view-sales/:id" element={<ProtectedRoute element={<ViewSales />} />} />
        <Route path="/edit-sales/:id" element={<ProtectedRoute element={<EditSales />} />} />
        <Route path="/purchase-tiles-list" element={<ProtectedRoute element={<PurchaseSale />} />} />
        <Route path="/purchase-granite-list" element={<ProtectedRoute element={<PurchaseGraniteList />} />} />
        <Route path="/view-purchase/:id" element={<ProtectedRoute element={<ViewPurchase />} />} />
        <Route path="/view-purchase-tiles/:id" element={<ProtectedRoute element={<ViewPurchaseTiles />} />} />
        <Route path="/stock-form" element={<ProtectedRoute element={<StockForm />} />} />
        <Route path="/stock-report" element={<ProtectedRoute element={<StockReport />} />} />
        <Route
          path="/add-daybook"
          element={<ProtectedRoute element={<AdddayBook />} />}
        />
        <Route
          path="/edit-daybook"
          element={<ProtectedRoute element={<EditdayBook />} />}
        />
        <Route
          path="/daybook-report"
          element={<ProtectedRoute element={<DayBookReports />} />}
        />
        <Route
          path="/ledger"
          element={<ProtectedRoute element={<Ledger />} />}
        />
        <Route
          path="/ledgerReport"
          element={<ProtectedRoute element={<LedgerReport />} />}
        />
        <Route
          path="/trialBalance"
          element={<ProtectedRoute element={<TrialBalance />} />}
        />
        <Route
          path="/trialBalanceReport"
          element={<ProtectedRoute element={<TrialBalanceReport />} />}
        />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route
          path="/table"
          element={<ProtectedRoute element={<Registration />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
