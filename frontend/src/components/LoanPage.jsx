import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const LoanPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();

  // State variables to hold loan details
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiBaseUrl } = useAuth();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setLoading(true);

      try {
        const response = await fetch(apiBaseUrl + `/api/loans/${loanId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // Check for unauthorized response
        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized access");
          navigate("/login"); // Redirect to home page
          return;
        }

        const data = await response.json();

        // Once we have the data, we update our state
        console.log("Success:", data);
        setLoanDetails(data);

        // Fetch additional payment history data
      } catch (error) {
        console.error("Error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId, navigate, apiBaseUrl]);

  // Make sure loanDetails exists before trying to access its properties
  const repayment =
    loanDetails && loanDetails.repayments && loanDetails.repayments[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="mt-4">Loading loan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-900 text-white">
        <div className="p-5 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-900 text-white">
        <div className="p-5 border border-gray-700 rounded-lg">
          <p>No loan details found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 rounded-lg shadow-md max-w-7xl mx-auto text-white">
      <header className="flex flex-col justify-between mb-6 pb-6 border-b border-gray-700 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 m-0">Loan Details</h1>
          <p className="mt-1 text-gray-400">
            View information about your loan #{loanId}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/repay/${loanId}`}
            className="bg-white text-black border-none rounded-md py-2 px-4 text-sm cursor-pointer transition-colors hover:bg-gray-300 w-fit"
          >
            Make a Payment
          </Link>
          <button className="bg-transparent text-white border border-gray-600 rounded-md py-2 px-4 text-sm cursor-pointer transition-colors hover:bg-gray-800 w-fit">
            Download Statement
          </button>
        </div>
      </header>

      <div className="flex flex-row p-2 gap-4 items-center">
        <h2 className="text-base text-gray-400 m-0 ">Status:</h2>
        <p
          className={`text-lg font-bold m-0 ${
            loanDetails.status === "approved"
              ? "text-green-400"
              : loanDetails.status === "pending"
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          {loanDetails.status.charAt(0).toUpperCase() +
            loanDetails.status.slice(1)}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="border border-gray-700 rounded-lg p-5 hover:shadow-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
          <h2 className="text-base text-gray-400 m-0 mb-2.5">Balance</h2>
          <p className="text-3xl font-bold text-gray-100 m-0">
            ${parseFloat(repayment.total_due_amount).toLocaleString()}
          </p>
        </div>

        <div className="border border-gray-700 rounded-lg p-5 hover:shadow-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
          <h2 className="text-base text-gray-400 m-0 mb-2.5">Interest Rate</h2>
          <p className="text-3xl font-bold text-gray-100 m-0">
            {loanDetails.total_interest}%
          </p>
        </div>

        <div className="border border-gray-700 rounded-lg p-5 hover:shadow-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
          <h2 className="text-base text-gray-400 m-0 mb-2.5">Term Length</h2>
          <p className="text-3xl font-bold text-gray-100 m-0">
            {loanDetails.term_months} months
          </p>
        </div>

        <div className="border border-gray-700 rounded-lg p-5 hover:shadow-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
          <h2 className="text-base text-gray-400 m-0 mb-2.5">Next payment</h2>
          <p className="text-3xl font-bold text-gray-100 m-0">
            {repayment &&
              new Date(repayment.due_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </p>
        </div>
      </div>

      <section className="border border-gray-700 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg text-gray-300 m-0 mb-5">Loan Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500">Loan Amount</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${parseFloat(loanDetails.loan_amount).toLocaleString()}
            </p>
          </div>
          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500">Monthly Payment (EMI)</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${parseFloat(repayment.expected_monthly_payment).toLocaleString()}
              {/*
                The `?.` is the optional chaining operator that safely accesses properties that might be null/undefined.
                It only calls toFixed(2) if metrics and metrics.emi exist, preventing errors.
                toFixed(2) formats the number to 2 decimal places.
                The entire expression is wrapped in ${} for template string interpolation.
              */}
            </p>
          </div>

          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500">Total Interest</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              $
              {parseInt(
                repayment.repay_amount_with_interest - loanDetails.loan_amount,
              ).toLocaleString()}
            </p>
          </div>

          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500">Total Payment</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${parseInt(repayment.repay_amount_with_interest).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="border border-gray-700 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg text-gray-300 m-0 mb-5">Payment Progress</h2>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>
              Amount Paid: $
              {parseFloat(
                repayment.repay_amount_with_interest -
                  repayment.total_due_amount,
              ).toLocaleString()}
            </span>
            <span>
              Remaining: $
              {parseFloat(repayment.total_due_amount).toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${((repayment.repay_amount_with_interest - repayment.total_due_amount) / repayment.repay_amount_with_interest) * 100}%`,
              }}
            ></div>
            <div className="mt-2 text-sm text-gray-400">
              Next Payment Due:{" "}
              {new Date(repayment.due_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanPage;
