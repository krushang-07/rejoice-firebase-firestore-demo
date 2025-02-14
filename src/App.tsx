import React, { lazy, Suspense } from "react";

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./utils/Loader.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const EmployeeRegistrationForm = lazy(
  () => import("./components/EmployeeRegistration.tsx")
);

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <EmployeeRegistrationForm />
        </Suspense>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </>
  );
}

export default App;
