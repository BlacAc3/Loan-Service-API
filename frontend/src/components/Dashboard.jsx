// import React, { useState } from "react";

import { Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import LoanMetrics from "./Overview";
import { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import * as Tabs from "@radix-ui/react-tabs";
import Modal from "react-modal";

const Dashboard = () => {
  const [loans, updateLoans] = useState();
  const [user, setUser] = useState();
  const [change, makeChange] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  Modal.setAppElement("#root");
  const { apiBaseUrl } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch loans and user data in parallel
        const [loansResponse, userResponse] = await Promise.all([
          fetch(apiBaseUrl + "/api/loans/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          fetch(apiBaseUrl + "/api/auth/user/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);

        // Process loans data
        const loansData = await loansResponse.json();
        console.log("Success:", loansData);
        updateLoans(loansData);

        // Process user data
        const userData = await userResponse.json();
        console.log("Success:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error:", error);

        // Handle error response here, e.g., show an error message to the user
      } finally {
        makeChange(false);
        setLoading(false);
        showNotification(
          "Click the pending button to approve a loan!",
          "success",
        );
      }
    };

    fetchData();
  }, [change, apiBaseUrl]);
  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.classList.add(
      "fixed",
      "top-4",
      "left-1/2",
      "transform",
      "translate-x-[-50%]",
      "p-2",
      "rounded-lg",
      "text-white",
      "font-bold",
      "z-50",
      "transition-all",
      "duration-500",
    );
    if (type === "success") {
      notification.classList.add("bg-green-700");
    } else {
      notification.classList.add("bg-red-700");
    }
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("opacity-0");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  const ApproveLoan = async (loan_id) => {
    try {
      setLoading(true);
      const response = await fetch(
        apiBaseUrl + `/api/loans/${loan_id}/approve/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const data = await response.json();
      console.log("Success approve loan:", data);
      // Handle success response here, e.g., show a success message to the user
      makeChange(true);
    } catch (error) {
      console.error("Error approve loan:", error);
      // Handle error response here, e.g., show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const RejectLoan = async (loan_id) => {
    try {
      setLoading(true);
      const response = await fetch(
        apiBaseUrl + `/api/loans/${loan_id}/reject/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const data = await response.json();
      console.log("Success in rejecting loan:", data);
      // Handle success response here, e.g., show a success message to the user
      makeChange(true);
    } catch (error) {
      console.error("Error while rejecting loan:", error);
      // Handle error response here, e.g., show an error message to the user
    } finally {
      setLoading(false);
    }
  };
  // console.log(user.due_date);

  let stats = [
    { title: "Total Loan Amount", value: "$21,000" },
    { title: "Remaining Balance", value: "$1,234" },
    { title: "Interest Rates", value: "89%" },
    { title: "Next Payment", value: "12" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        <p className="text-white ml-4 text-xl">Loading data...</p>
      </div>
    );
  }

  if (user) {
    stats = [
      {
        title: "Total Loan Amount",
        value: `$${parseFloat(user.totalLoanAmount).toLocaleString()}`,
      },
      {
        title: "Remaining Balance",
        value: `$${parseFloat(user.totalRemainingBalance).toLocaleString()}`,
      },
      {
        title: "Interest Rates",
        value: `${parseFloat(user.meanInterestRate).toLocaleString()}%`,
      },
      {
        title: "Next Payment",
        value: `${user.nextPayment}`,
      },
    ];
  }

  return (
    <>
      <div className="p-4">
        <header className="flex flex-col justify-between mb-6 pb-6 border-b border-gray-700 gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 m-0">Dashboard</h1>
            <p className="mt-1 text-gray-400">Welcome back, Ace.</p>
          </div>
          <Link to="/apply">
            <button className="bg-white text-black border-none rounded-md py-2 px-4 text-sm cursor-pointer transition-colors hover:bg-gray-300 w-fit">
              Apply for a New loan
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg p-5 hover:shadow-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <h2 className="text-base text-gray-400 m-0 mb-2.5">
                {stat.title}
              </h2>
              <p className="text-3xl font-bold text-gray-100 m-0">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <Tabs.Root
          defaultValue="approved"
          className=" p-6 border border-gray-700 rounded-lg mt-6"
        >
          <div className="mb-4">
            <h1 className="text-2xl text-gray-300 font-semibold">
              Applications
            </h1>
            <p className="text-gray-400">Your recent loan applications</p>
          </div>

          {/* Tab Header */}
          <Tabs.List className="flex flex-col sm:flex-row w-full items-center text-white rounded-lg p-2">
            <Tabs.Trigger
              value="pending"
              className="px-3 py-2 w-full sm:w-1/3 transition-all duration-300 border border-transparent rounded-lg data-[state=active]:border-stone-500 data-[state=active]:bg-stone-950 mb-2 sm:mb-0 sm:mr-2"
            >
              Pending
            </Tabs.Trigger>
            <Tabs.Trigger
              value="approved"
              className="px-3 py-2 w-full sm:w-1/3 transition-all duration-300 border border-transparent rounded-lg data-[state=active]:border-stone-500 data-[state=active]:bg-stone-950 mb-2 sm:mb-0 sm:mr-2"
            >
              Approved
            </Tabs.Trigger>
            <Tabs.Trigger
              value="rejected"
              className="px-3 py-2 w-full sm:w-1/3 transition-all duration-300 border border-transparent rounded-lg data-[state=active]:border-stone-500 data-[state=active]:bg-stone-950 mb-2 sm:mb-0"
            >
              Rejected
            </Tabs.Trigger>
            <Tabs.Trigger
              value="paid"
              className="px-3 py-2 w-full sm:w-1/3 transition-all duration-300 border border-transparent rounded-lg data-[state=active]:border-stone-500 data-[state=active]:bg-stone-950 mb-2 sm:mb-0"
            >
              Paid
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="approved"
            className="overflow-x-auto overflow-y-scroll h-[50vh]"
          >
            {loans && loans.length > 0 ? (
              loans
                .slice(0, 50)
                .filter((loan) => loan.status === "approved")
                .map((loan, index) => (
                  <Link
                    to={`/loan/${loan.id}`}
                    key={index}
                    className="flex justify-between items-center border-t border-gray-700 py-2 px-4 cursor-pointer"
                  >
                    <div>
                      <div className="text-gray-200 font-bold">
                        Loan Application ID: {loan.id}
                      </div>
                      <div className="text-gray-400">
                        Next Payment on{" "}
                        {loan.repayments[0].due_date
                          ? new Date(
                              loan.repayments[0].due_date,
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div
                      className={`rounded-3xl text-xs font-[500] cursor-pointer h-fit w-fit px-3 p-1 ${loan.status === "approved" ? "bg-green-200 text-green-800" : loan.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </div>
                  </Link>
                ))
            ) : (
              <div className="flex justify-center items-center border-t border-gray-700 py-2 px-4 text-gray-400">
                No applications found.
              </div>
            )}
          </Tabs.Content>
          <Tabs.Content
            value="rejected"
            className="overflow-x-auto overflow-y-scroll h-[50vh]"
          >
            {loans && loans.length > 0 ? (
              loans
                .slice(0, 50)
                .filter((loan) => loan.status === "rejected")
                .map((loan, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-t border-gray-700 py-2 px-4 cursor-pointer"
                  >
                    <Link to={`/loan/${loan.id}`}>
                      <div className="text-gray-200 font-bold">
                        Loan Application ID: {loan.id}
                      </div>
                      <div className="text-gray-400">
                        Applied on{" "}
                        {new Date(loan.created_at).toLocaleDateString()}
                      </div>
                    </Link>
                    <div
                      className={`rounded-3xl text-xs font-[500] cursor-pointer h-fit w-fit px-3 p-1 ${loan.status === "approved" ? "bg-green-200 text-green-800" : loan.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center border-t border-gray-700 py-2 px-4 text-gray-400">
                No applications found.
              </div>
            )}
          </Tabs.Content>
          <Tabs.Content
            value="paid"
            className="overflow-x-auto overflow-y-scroll h-[50vh]"
          >
            {loans && loans.length > 0 ? (
              loans
                .slice(0, 50)
                .filter((loan) => loan.status === "paid")
                .map((loan, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-t border-gray-700 py-2 px-4 cursor-pointer"
                  >
                    <Link to={`/loan/${loan.id}`}>
                      <div className="text-gray-200 font-bold">
                        Loan Application ID: {loan.id}
                      </div>
                      <div className="text-gray-400">
                        Applied on{" "}
                        {new Date(loan.created_at).toLocaleDateString()}
                      </div>
                    </Link>
                    <div
                      className={`rounded-3xl text-xs font-[500] cursor-pointer h-fit w-fit px-3 p-1 ${loan.status === "approved" ? "bg-green-200 text-green-800" : loan.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center border-t border-gray-700 py-2 px-4 text-gray-400">
                No applications found.
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content
            value="pending"
            className="overflow-x-auto overflow-y-scroll h-[50vh]"
          >
            {loans && loans.length > 0 ? (
              loans
                .slice(0, 50)
                .filter((loan) => loan.status === "pending")
                .map((loan, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-t border-gray-700 py-2 px-4"
                  >
                    <div>
                      <div className="text-gray-200 font-bold">
                        Loan Application ID: {loan.id}
                      </div>
                      <div className="text-gray-400">
                        Applied on{" "}
                        {new Date(loan.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`rounded-3xl text-xs font-[500] cursor-pointer h-fit w-fit px-3 p-1 ${loan.status === "approved" ? "bg-green-200 text-green-800" : loan.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
                      onClick={() => ApproveLoan(loan.id)}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center border-t border-gray-700 py-2 px-4 text-gray-400">
                No applications found.
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
};

export default Dashboard;
