import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

try {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Failed to render app:", error);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red;">Error loading app: ${error}</div>`;
  }
}
  
