import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/home/homepage";
import NotFoundPage from "../pages/NotFound/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
