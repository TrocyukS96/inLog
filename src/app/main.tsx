import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import i18n from "../shared/i18n/locales/i18n";
import '../shared/styles/index.css';
import { AppRouter } from "./routing/AppRouter";
import { store } from "./store/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppRouter />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </I18nextProvider >
    </Provider>
  </React.StrictMode >
);