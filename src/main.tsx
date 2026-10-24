import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FavoritesProvider } from "./context/FavoriteContext.tsx";
import "./styles/global.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>,
);
