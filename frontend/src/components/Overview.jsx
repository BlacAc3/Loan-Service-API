import React, { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const LoanMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const { apiBaseUrl } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(apiBaseUrl + "/api/auth/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Failed to load metrics data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [apiBaseUrl]);

  // Format currency numbers
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for loan status doughnut chart
  const getLoanStatusData = () => {
    if (!metrics) return null;

    return {
      labels: ["Approved", "Pending", "Rejected", "Settled"],
      datasets: [
        {
          data: [
            parseInt(metrics.approvedLoans) || 0,
            parseInt(metrics.pendingLoans) || 0,
            parseInt(metrics.rejectedLoans) || 0,
            parseInt(metrics.settledLoans) || 0,
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgb(229, 231, 235)",
          padding: 15,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleColor: "rgb(229, 231, 235)",
        bodyColor: "rgb(229, 231, 235)",
        borderColor: "rgb(75, 85, 99)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-400">
        <p>{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-center text-gray-400">No data available</div>;
  }

  // Calculate payment progress
  const totalLoanAmount = parseFloat(metrics.totalLoanAmount) || 0;
  const remainingBalance = parseFloat(metrics.totalRemainingBalance) || 0;
  const paidAmount = totalLoanAmount - remainingBalance;
  const paymentPercentage = totalLoanAmount
    ? Math.round((paidAmount / totalLoanAmount) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left side - Doughnut chart */}
      <div className="flex flex-col justify-center">
        <div className="h-[220px] relative">
          <Doughnut data={getLoanStatusData()} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {metrics.totalAppliedLoans}
            </span>
            <span className="text-sm text-gray-400">Total Loans</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-stone-800">
            <span className="text-sm text-gray-400">Approved</span>
            <span className="text-green-400 font-medium">
              {metrics.approvedLoans || 0}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-stone-800">
            <span className="text-sm text-gray-400">Pending</span>
            <span className="text-yellow-400 font-medium">
              {metrics.pendingLoans || 0}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-stone-800">
            <span className="text-sm text-gray-400">Rejected</span>
            <span className="text-red-400 font-medium">
              {metrics.rejectedLoans || 0}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-stone-800">
            <span className="text-sm text-gray-400">Settled</span>
            <span className="text-blue-400 font-medium">
              {metrics.settledLoans || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Financial metrics */}
      <div className="flex flex-col justify-center">
        <div className="space-y-5">
          <div>
            <h3 className="text-gray-400 text-sm mb-2">Payment Progress</h3>
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{ width: `${paymentPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                Paid: {formatCurrency(paidAmount)}
              </span>
              <span className="text-xs text-gray-400">
                {paymentPercentage}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border border-gray-800 rounded-lg bg-stone-900">
              <h3 className="text-gray-500 text-xs mb-1">Total Loan Amount</h3>
              <p className="text-lg font-bold text-white">
                {formatCurrency(metrics.totalLoanAmount)}
              </p>
            </div>
            <div className="p-3 border border-gray-800 rounded-lg bg-stone-900">
              <h3 className="text-gray-500 text-xs mb-1">Remaining Balance</h3>
              <p className="text-lg font-bold text-white">
                {formatCurrency(metrics.totalRemainingBalance)}
              </p>
            </div>
            <div className="p-3 border border-gray-800 rounded-lg bg-stone-900">
              <h3 className="text-gray-500 text-xs mb-1">
                Average Interest Rate
              </h3>
              <p className="text-lg font-bold text-white">
                {metrics.meanInterestRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanMetrics;
