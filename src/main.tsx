// Node modules
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Styles
import "@/index.css";
import "mapbox-gl/dist/mapbox-gl.css";

// Components
import { App } from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
