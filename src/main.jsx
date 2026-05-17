import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { HeadProvider } from "react-head";
import AppRouter from "./Router/AppRouter.jsx";
import { AuthProvider } from "./Context/AuthProvider.jsx";
import { NotificationProvider } from "./Context/NotificationContext.jsx";
import { CategoriesProvider } from "./Context/CategoriesProvider.jsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import './I18n';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <CategoriesProvider>
              <HeadProvider>
                <AppRouter>
                  <App />
                </AppRouter>
              </HeadProvider>
            </CategoriesProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
