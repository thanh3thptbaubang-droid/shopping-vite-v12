import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/Profile";
import RegisterSeller from "./pages/RegisterSeller";
import Wallet from "./pages/Wallet";
import RevenueReport from "./pages/RevenueReport";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-seller" element={<RegisterSeller />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/revenue" element={<RevenueReport />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}