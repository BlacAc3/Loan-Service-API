import { useState, useMemo } from "react";
import CalenderIcon from "../assets/calender-icon.svg";
import * as Tabs from "@radix-ui/react-tabs";

const CalculatorSection = ({ page, send_request }) => {
  let width = "";
  if (page === "apply") {
    width = "";
  } else {
    width = "max-w-md lg:max-w-lg";
  }
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(120);
  const [sent, setIsSent] = useState(false);

  const monthlyPayment = useMemo(() => {
    const principal = loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    if (monthlyInterestRate === 0) {
      return principal / numberOfPayments;
    }

    const numerator =
      principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

    return numerator / denominator;
  }, [loanAmount, interestRate, loanTerm]);

  const totalPayment = useMemo(() => {
    return monthlyPayment * loanTerm;
  }, [monthlyPayment, loanTerm]);

  const totalInterest = useMemo(() => {
    // Total Interest Paid
    setIsSent(false);
    return totalPayment - loanAmount;
  }, [totalPayment, loanAmount]);

  const send_calc_details = () => {
    if (page === "apply") {
      setIsSent(true);
      send_request(loanAmount, loanTerm, interestRate);
    }
  };

  return (
    <div
      className={`p-3 border-[0.5px] border-gray-800 rounded-xl self-center w-full ${width} bg-[#0a0a0c]`}
    >
      <Tabs.Root defaultValue="tab1" className="w-full text-white">
        {/* Tab List */}
        <Tabs.List className="flex w-full items-center bg-[#1B1B1B] rounded-lg p-2">
          <Tabs.Trigger
            value="tab1"
            className="px-3 py-2 w-1/3 rounded-lg transition-all duration-300 data-[state=active]:bg-black"
          >
            Personal
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab2"
            className="px-3 py-2 w-1/3 rounded-lg transition-all duration-300 data-[state=active]:bg-black"
          >
            Home
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab3"
            className="px-3 py-2 w-1/3 rounded-lg transition-all duration-300 data-[state=active]:bg-black"
          >
            Auto
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab Panels */}
        <Tabs.Content value="tab1" className="flex flex-col gap-6 md:gap-2 p-4">
          <div className="mt-4">
            <label
              htmlFor="loan-amount"
              className="flex justify-between text-sm font-medium text-white"
            >
              <h1>Loan Amount</h1>
              <p className="p-1 border border-gray-700 px-3 rounded-lg">
                $ {loanAmount.toLocaleString()}
              </p>
            </label>
            <input
              type="range"
              id="loan-amount"
              min="1000"
              step="500"
              max="100000"
              value={loanAmount}
              className="w-full mt-1 [&::-webkit-slider-runnable-track]:bg-gray-700 [&::-webkit-slider-thumb]:bg-white"
              onChange={(e) => {
                setLoanAmount(parseInt(e.target.value));
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="loan-term"
              className="flex justify-between text-sm font-medium text-white"
            >
              <h1>Loan Term</h1>
              <div className="flex items-center gap-2 p-1 border border-gray-800 px-3 rounded-lg">
                <img className="h-4 w-4" alt="calender" src={CalenderIcon} />
                <p>{loanTerm} months</p>
              </div>
            </label>
            <input
              type="range"
              id="loan-term"
              min="12"
              max="84"
              value={loanTerm}
              className="w-full mt-1 [&::-webkit-slider-runnable-track]:bg-gray-700 [&::-webkit-slider-thumb]:bg-white"
              onChange={(e) => {
                setLoanTerm(parseInt(e.target.value));
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>12 Months</span>
              <span>84 Months</span>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="interest-rate"
              className="flex justify-between text-sm font-medium text-white"
            >
              <div>Annual Interest Rate</div>
              <p className="p-1 border border-gray-800 px-3 rounded-lg">
                {interestRate}%
              </p>
            </label>
            <input
              type="range"
              id="interest-rate"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              className="w-full mt-1 [&::-webkit-slider-runnable-track]:bg-gray-700 [&::-webkit-slider-thumb]:bg-white"
              onChange={(e) => {
                setInterestRate(parseFloat(e.target.value));
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row md:flex-wrap lg:flex-nowrap">
            <div className="border border-gray-800 lg:flex lg:flex-col lg:justify-center p-4 rounded-lg">
              <h3 className="text-gray-500 break-words w-full">
                Estimated Monthly Payment
              </h3>
              <p className="text-2xl font-bold whitespace-nowrap mt-2 text-white">
                ${monthlyPayment.toFixed(2)}
              </p>
            </div>
            <div className="border border-gray-800 lg:flex lg:flex-col lg:justify-center p-4 rounded-lg">
              <h3 className="text-gray-500">Total Interest</h3>
              <p className="text-2xl font-bold mt-2 text-white">
                ${totalInterest.toFixed(2)}
              </p>
            </div>

            <div className="border border-gray-800 lg:flex lg:flex-col lg:justify-center p-4 rounded-lg">
              <h3 className="text-gray-500">Total Payment</h3>
              <p className="text-2xl font-bold mt-2 text-white">
                ${totalPayment.toFixed(2)}
              </p>
            </div>
          </div>
          {!sent ? (
            <a
              onClick={send_calc_details}
              className="w-full text-center py-3 px-8 cursor-pointer text-black bg-sky-50 transition-all hover:bg-slate-300 duration-500 rounded-lg"
            >
              Apply Now
            </a>
          ) : (
            <a className="w-full bg-green-700 border border-gray-600 text-center py-3 px-8 cursor-pointer text-black transition-all duration-500 rounded-lg">
              Sent
            </a>
          )}
        </Tabs.Content>
        <Tabs.Content value="tab2" className="p-4">
          <p>Coming Soon</p>
        </Tabs.Content>
        <Tabs.Content value="tab3" className="p-4">
          <p>Coming Soon</p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default CalculatorSection;
