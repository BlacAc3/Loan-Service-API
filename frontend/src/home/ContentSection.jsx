import NoteIcon from "../assets/note-text.svg";
import ClockIcon from "../assets/clock.svg";
import ClockIconDark from "../assets/clock-dark.svg";
import CardIcon from "../assets/payment-card.svg";
import GraphIcon from "../assets/graph.svg";
import MobileIcon from "../assets/mobile.svg";
import WalletIcon from "../assets/wallet.svg";
import CheckCircleDark from "../assets/check-circle-dark.svg";
import CheckCircle from "../assets/check-circle.svg";
import ShieldIcon from "../assets/shield-alt.svg";

const ContentSection = () => {
  return (
    <>
      <section className="mt-44">
        <div className="text-center space-y-2">
          <h1 className="font-semibold prose text-3xl md:text-5xl text-white">
            How It Works
          </h1>
          <p className="text-gray-400">
            Our simple four-step process makes getting a loan quick and
            hassle-free.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 px-4 md:px-6 pb-16 pt-10 lg:grid-cols-4">
          <li className="flex flex-col items-center gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
            <div className="bg-white p-3 rounded-full">
              <img className="w-6 h-6" alt="icon" src={NoteIcon} />
            </div>
            <h1 className="text-xl font-bold">Apply Online</h1>
            <p className="text-gray-500">
              Fill out our simple application form in just minutes from any
              device.
            </p>
          </li>

          <li className="flex flex-col items-center gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
            <div className="bg-white p-3 rounded-full">
              <img className="w-6 h-6" alt="icon" src={ClockIconDark} />
            </div>
            <h1 className="text-xl font-bold">Quick Decision</h1>
            <p className="text-gray-500">
              Get a decision within hours, not days, with our streamlined
              process.
            </p>
          </li>

          <li className="flex flex-col items-center gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
            <div className="bg-white p-3 rounded-full">
              <img className="w-6 h-6" alt="icon" src={CheckCircleDark} />
            </div>
            <h1 className="text-xl font-bold">Received Funds</h1>
            <p className="text-gray-500">
              Once approved, funds are deposited directly to your account.
            </p>
          </li>

          <li className="flex flex-col items-center gap-5 p-6 rounded-xl border border-gray-600 text-white bg-[#09090B]">
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

      <section className="text-white space-y-12 p-8 bg-[#09090B] ">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">Why Choose Us</h1>
          <p className="text-gray-500">
            We're committed to providing the best loan experience with these key
            benefits.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 md:max-w-6xl mx-auto px-6 lg:px-20 md:px-6 pb-16 pt-10 lg:grid-cols-3">
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={ShieldIcon} />
            </div>
            <h1 className="font-semibold text-xl">Secure Process</h1>
            <p className="text-gray-500">
              Bank-level security protocols to protect your personal and
              financial information.
            </p>
          </li>
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={ClockIcon} />
            </div>
            <h1 className="font-semibold text-xl">Fast Approval</h1>
            <p className="text-gray-500">
              Get approved quickly with our streamlined application process and
              rapid decision-making.
            </p>
          </li>
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={GraphIcon} />
            </div>
            <h1 className="font-semibold text-xl">Competitive Rates</h1>
            <p className="text-gray-500">
              We offer some of the most competitive interest rates in the
              industry.
            </p>
          </li>
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={MobileIcon} />
            </div>
            <h1 className="font-semibold text-xl">Mobile Friendly</h1>
            <p className="text-gray-500">
              Apply, manage, and track your loan from any device, anywhere,
              anytime.
            </p>
          </li>
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={CheckCircle} />
            </div>
            <h1 className="font-semibold text-xl">Flexible Terms</h1>
            <p className="text-gray-500">
              Choose from a variety of loan terms that fit your financial
              situation and goals.
            </p>
          </li>
          <li className="flex flex-col gap-3 border border-gray-800 p-6 rounded-xl">
            <div className="bg-gray-800 rounded-full w-fit p-2">
              <img className="h-7 w-7 " alt="" src={WalletIcon} />
            </div>
            <h1 className="font-semibold text-xl">No hidden Fees</h1>
            <p className="text-gray-500">
              Transparent fee structure with no surprises or hidden charges.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
};

export default ContentSection;
