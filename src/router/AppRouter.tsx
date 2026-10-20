import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import HomePage from "../pages/home/homepage";
import ContactPage from "../pages/contact/ContactPage";
import ApartmentsPage from "../pages/apartments/ApartmentsPage";
import ApartmentDetailPage from "../pages/apartmentDetail/ApartmentDetailPage";
import FavoritesPage from "../pages/favorite/FavoritePage";
import NotFoundPage from "../pages/NotFound/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/apartamentos" element={<ApartmentsPage />} />
          <Route path="/apartamentos/:id" element={<ApartmentDetailPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
