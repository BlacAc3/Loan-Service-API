import React from "react";
import CalculatorSection from "../home/CalculatorSection";

const LoanApplication = () => {
  const send_request = (loan_amount, term_months, annual_interest_rate) => {
    const request_body = {
      loan_amount: loan_amount,
      total_interest: annual_interest_rate,
      term_months: term_months,
    };

    fetch("http://localhost:8000/api/loans/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(request_body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success response here, e.g., show a success message to the user
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error response here, e.g., show an error message to the user
      });
  };
  return (
    <div className="text-white min-h-screen flex flex-col mx-auto md:max-w-xl justify-center items-center w-full p-4 ">
      {/* <h3 className="text-xl font-semibold text-white mb-4">Loan Calculator</h3> */}
      <CalculatorSection page="apply" send_request={send_request} />
    </div>
  );
};

export default LoanApplication;
