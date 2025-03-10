// import { useState } from "react";
import "./App.css";
import HomePage from "./home/HomePage.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./components/LoginPage.jsx";
import LoanPage from "./components/LoanPage.jsx";
import DashboardPage from "./components/Dashboard.jsx";
import ApplyPage from "./components/ApplyPage.jsx";
import RepayPage from "./components/PaymentPage.jsx";
import Protected from "./utils/Protected.jsx";
import { Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage command="login" />} />
        <Route path="/logout" element={<LoginPage command="logout" />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          path="/apply"
          element={
            <Protected>
              <ApplyPage />
            </Protected>
          }
        />
        <Route
          path="repay/:loanId"
          element={
            <Protected>
              <RepayPage />
            </Protected>
          }
        />
        <Route
          path="/loan/:loanId"
          element={
            <Protected>
              <LoanPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
