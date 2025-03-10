import ArrowRight from "../assets/arrow-right.svg";
import CheckCircle from "../assets/check-circle.svg";
import ShieldIcon from "../assets/shield-alt.svg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="text-white flex flex-col gap-4 text-start ">
      <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl">
        Financial Freedom Starts with Smart Borrowing
      </h1>
      <p className="text-slate-300">
        Apply for a loan in minutes, get competitive rates, and manage your
        payments all in one place.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="signup"
          className="py-2 bg-white flex items-center gap-3 text-black rounded-lg px-10 cursor-pointer transition-colors duration-500 hover:bg-slate-200"
        >
          <p>Apply Now</p>
          <img className="h-4 w-4" alt="arrow-right" src={ArrowRight} />
        </Link>
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

export default HeroSection;
