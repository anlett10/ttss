/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/react-start";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

// Create router instance
const router = createRouter();

// Define the root component
function ClientApp() {
  return (
    <StrictMode>
      <StartClient router={router} />
    </StrictMode>
  );
}

// Perform hydration
hydrateRoot(
  document,
  <ClientApp />
);

// Export the component as default
export default ClientApp;
