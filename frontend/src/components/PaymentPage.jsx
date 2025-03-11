import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import * as Tabs from "@radix-ui/react-tabs";

const PaymentPage = ({ isAuthenticated }) => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loanDetails, setLoanDetails] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { apiBaseUrl } = useAuth();

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);

        // Fetch loan repayment schedule
        const response = await fetch(
          apiBaseUrl + `/api/loans/${loanId}/schedule/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch loan schedule: ${response.status}`);
        }

        const data = await response.json();
        console.log("Repayment schedule:", data);

        if (data.schedule) {
          setSchedule(data.schedule);
        }

        if (data.loan) {
          setLoanDetails(data.loan);
          // Set default payment amount to the next due payment amount if available
          const nextPayment = data.schedule.find(
            (payment) => payment.status === "pending",
          );
          if (nextPayment) {
            setPaymentAmount(nextPayment.amount_due.toString());
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching loan schedule:", err);
        setError("Failed to load repayment schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [loanId, isAuthenticated, navigate, apiBaseUrl]);

  const validateForm = () => {
    const errors = {};

    if (
      !paymentAmount ||
      isNaN(parseFloat(paymentAmount)) ||
      parseFloat(paymentAmount) < 0
    ) {
      errors.paymentAmount = "Please enter a valid payment amount above $100";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Make the payment API call
      const response = await fetch(apiBaseUrl + `/api/repayments/${loanId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          // payment_method: paymentMethod,
          // Include other payment details as needed by your API
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment successful:", data);

      // Show success message and reset form
      setPaymentSuccess(true);

      // Refresh the schedule data after successful payment
      setTimeout(() => {
        navigate(`/loan/${loanId}`);
      }, 3000);
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Payment processing failed. Please try again later.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-200 text-green-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "overdue":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col p-5 rounded-lg shadow-md max-w-7xl mx-auto">
        <div className="bg-red-900 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-white text-red-900 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 rounded-lg shadow-md max-w-7xl mx-auto">
      <header className="flex flex-col justify-between mb-6 pb-6 border-b border-gray-700 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 m-0">Loan Payment</h1>
          <p className="mt-1 text-gray-400">
            Loan ID: {loanId} {loanDetails && `- ${loanDetails.purpose}`}
          </p>
        </div>
      </header>

      {paymentSuccess ? (
        <div className="bg-green-900/30 border border-green-700 p-6 rounded-lg text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your payment has been processed successfully.
          </p>
          <button
            onClick={() => navigate(`/loan/${loanId}`)}
            className="bg-white text-black border-none rounded-md py-2 px-4 text-sm cursor-pointer transition-colors hover:bg-gray-300"
          >
            Return to Loan Dashboard.
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-gray-700 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg text-gray-300 m-0 mb-5">
              Payment Details (Fill only the amount field for this project )
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="payment_amount"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    id="payment_amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-stone-900 border border-gray-700 text-white pl-8 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                {formErrors.paymentAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.paymentAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credit_card")}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      paymentMethod === "credit_card"
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-gray-700 bg-stone-900 text-gray-300 hover:bg-stone-800"
                    }`}
                  >
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      paymentMethod === "bank_transfer"
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-gray-700 bg-stone-900 text-gray-300 hover:bg-stone-800"
                    }`}
                  >
                    <span>Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      paymentMethod === "wallet"
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-gray-700 bg-stone-900 text-gray-300 hover:bg-stone-800"
                    }`}
                  >
                    <span>Wallet</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="card_number"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card_number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="bg-stone-900 border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {formErrors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="card_name"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="card_name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-stone-900 border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                    {formErrors.cardName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.cardName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiry_date"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry_date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="bg-stone-900 border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {formErrors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="bg-stone-900 border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        maxLength="4"
                      />
                      {formErrors.cvv && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="border border-gray-700 rounded-lg p-4 bg-stone-900">
                  <h3 className="text-gray-300 font-medium mb-3">
                    Bank Transfer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">
                      Please transfer the amount to the following account:
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank Name:</span>
                      <span className="text-white">First National Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Number:</span>
                      <span className="text-white">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Routing Number:</span>
                      <span className="text-white">987654321</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="text-white">LOAN-{loanId}</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="border border-gray-700 rounded-lg p-4 bg-stone-900">
                  <h3 className="text-gray-300 font-medium mb-3">
                    Digital Wallet
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Select your preferred digital wallet:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center p-3 border border-gray-700 rounded-md bg-stone-800 hover:bg-stone-700"
                      >
                        <span className="text-blue-400 text-2xl mb-1">P</span>
                        <span className="text-xs text-gray-300">PayPal</span>
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center p-3 border border-gray-700 rounded-md bg-stone-800 hover:bg-stone-700"
                      >
                        <span className="text-green-400 text-2xl mb-1">C</span>
                        <span className="text-xs text-gray-300">Cash App</span>
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center p-3 border border-gray-700 rounded-md bg-stone-800 hover:bg-stone-700"
                      >
                        <span className="text-yellow-400 text-2xl mb-1">V</span>
                        <span className="text-xs text-gray-300">Venmo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processingPayment}
                  className={`w-full bg-white text-black border-none rounded-md py-3 px-4 font-medium cursor-pointer transition-colors hover:bg-gray-300 ${
                    processingPayment ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {processingPayment ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay ${paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : "$0.00"}`
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="border border-gray-700 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg text-gray-300 m-0 mb-5">
              Repayment Schedule
            </h2>

            {loanDetails && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm">Loan Amount</h3>
                  <p className="text-xl font-bold mt-1 text-white">
                    {formatCurrency(loanDetails.amount)}
                  </p>
                </div>
                <div className="border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm">Interest Rate</h3>
                  <p className="text-xl font-bold mt-1 text-white">
                    {loanDetails.interest_rate}%
                  </p>
                </div>
                <div className="border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm">Remaining Balance</h3>
                  <p className="text-xl font-bold mt-1 text-white">
                    {formatCurrency(loanDetails.remaining_balance || 0)}
                  </p>
                </div>
                <div className="border border-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-500 text-sm">Term</h3>
                  <p className="text-xl font-bold mt-1 text-white">
                    {loanDetails.term} months
                  </p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Principal</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.length > 0 ? (
                    schedule.map((payment, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 hover:bg-stone-900/50"
                      >
                        <td className="px-4 py-3 text-gray-300">
                          {formatDate(payment.due_date)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatCurrency(payment.amount_due)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(payment.status)}`}
                          >
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-3 text-center text-gray-400"
                      >
                        No repayment schedule available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
