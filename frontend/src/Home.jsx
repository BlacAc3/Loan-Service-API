import * as Tabs from "@radix-ui/react-tabs";
import ArrowRight from "./assets/arrow-right.svg";
import CheckCircle from "./assets/check-circle.svg";
import CheckCircleDark from "./assets/check-circle-dark.svg";
import ShieldIcon from "./assets/shield-alt.svg";
import CalenderIcon from "./assets/calender-icon.svg";
import NoteIcon from "./assets/note-text.svg";
import ClockIcon from "./assets/clock-two.svg";
import CardIcon from "./assets/payment-card.svg";

import { useState, useMemo } from "react";

const HeroSection = () => {
  return (
    <section className="text-white pt-28 flex flex-col gap-4 text-start ">
      <h1 className="font-semibold text-3xl">
        Financial Freedom Starts with Smart Borrowing
      </h1>
      <p className="text-slate-300">
        Apply for a loan in minutes, get competitive rates, and manage your
        payments all in one place.
      </p>
      <div className="flex flex-wrap gap-4">
        <a className="py-2 bg-white flex items-center gap-3 text-black rounded-lg px-10 cursor-pointer transition-colors duration-500 hover:bg-slate-200">
          <p>Apply Now</p>
          <img className="h-4 w-4" alt="arrow-right" src={ArrowRight} />
        </a>
        <a className="py-2 bg-[#1B1B1B] hover:bg-[#3D3D3D] cursor-pointer transition-colors duration-500 border text-white rounded-lg px-10">
          Calculate Your Rate
        </a>
      </div>
      <ul className="flex flex-wrap items-center gap-4 w-auto">
        <li className="flex items-center gap-2">
          <img className="w-4 h-4" alt="check-icon" src={CheckCircle} />
          <p>Fast approval</p>
        </li>
        <li className="flex items-center gap-2">
          <img className="w-4 h-4" alt="check-icon" src={CheckCircle} />
          <p>Competitive Rates</p>
        </li>
        <li className="flex items-center gap-2">
          <img
            className="text-white w-4 h-4"
            alt="shield-icon"
            src={ShieldIcon}
          />
          <p>Secure Process</p>
        </li>
      </ul>
    </section>
  );
};

const CalculatorSection = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(120);

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
    return totalPayment - loanAmount;
  }, [totalPayment, loanAmount]);

  return (
    <div className="p-3 border-[0.5px] border-gray-800 rounded-xl self-center w-full max-w-md bg-[#0a0a0c]">
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
        <Tabs.Content value="tab1" className="flex flex-col gap-6 p-4">
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

          <div className="border border-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-500">Estimated Monthly Payment</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${monthlyPayment.toFixed(2)}
            </p>
          </div>
          <div className="border border-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-500">Total Interest</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${totalInterest.toFixed(2)}
            </p>
          </div>

          <div className="border border-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-500">Total Payment</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              ${totalPayment.toFixed(2)}
            </p>
          </div>
          <a className="w-full text-center py-3 px-8 cursor-pointer text-black bg-sky-50 transition-all hover:bg-slate-300 duration-500 rounded-lg">
            Apply Now
          </a>
        </Tabs.Content>
        <Tabs.Content value="tab2" className="p-4">
          <p>Content for Tab 2</p>
        </Tabs.Content>
        <Tabs.Content value="tab3" className="p-4">
          <p>Content for Tab 3</p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const ContentSection = () => {
  return (
    <section>
      <div className="space-y-2">
        <h1 className="font-semibold prose text-3xl text-white">
          How It Works{" "}
        </h1>
        <p className="text-gray-400">
          Our simple four-step process makes getting a loan quick and
          hassle-free.
        </p>
      </div>
      <ul className="space-y-4">
        <li className="flex flex-col items-center mt-8 gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
          <div className="bg-white p-3 rounded-full">
            <img className="w-6 h-6" alt="icon" src={NoteIcon} />
          </div>
          <h1 className="text-xl font-bold">Apply Online</h1>
          <p className="text-gray-500">
            Fill out our simple application form in just minutes from any
            device.
          </p>
        </li>

        <li className="flex flex-col items-center mt-8 gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
          <div className="bg-white p-3 rounded-full">
            <img className="w-6 h-6" alt="icon" src={ClockIcon} />
          </div>
          <h1 className="text-xl font-bold">Quick Decision</h1>
          <p className="text-gray-500">
            Get a decision within hours, not days, with our streamlined process.
          </p>
        </li>

        <li className="flex flex-col items-center mt-8 gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
          <div className="bg-white p-3 rounded-full">
            <img className="w-6 h-6" alt="icon" src={CheckCircleDark} />
          </div>
          <h1 className="text-xl font-bold">Received Funds</h1>
          <p className="text-gray-500">
            Once approved, funds are deposited directly to your account.
          </p>
        </li>

        <li className="flex flex-col items-center mt-8 gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
          <div className="bg-white p-3 rounded-full">
            <img className="w-6 h-6" alt="icon" src={CardIcon} />
          </div>
          <h1 className="text-xl font-bold">Easy Repayment</h1>
          <p className="text-gray-500">
            Set up automatic payments and manage your loan through our
            dashboard.
          </p>
        </li>
      </ul>
    </section>
  );
};

export { HeroSection, CalculatorSection, ContentSection };
