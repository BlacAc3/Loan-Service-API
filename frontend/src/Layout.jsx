import hamburger from "./assets/hamburger.svg";

const Navbar = () => {
  return (
    <nav class="fixed top-0 overflow-hidden left-0 w-full z-50 bg-black bg-opacity-90 transition-colors duration-300">
      <div class="container h-fit px-6 py-4 border-b border-b-slate-300 flex items-center justify-between backdrop-blur-md">
        <div className=" text-white flex items-center gap-4">
          <img className="w-5 h-5" alt="hamburger-icon" src={hamburger} />
          <a href="#" class="text-white text-2xl font-bold">
            ZLoan
          </a>
        </div>

        <ul class="hidden md:flex space-x-6">
          <li>
            <a href="#" class="text-white hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="#" class="text-white hover:text-gray-300">
              About
            </a>
          </li>
          <li>
            <a href="#" class="text-white hover:text-gray-300">
              Services
            </a>
          </li>
          <li>
            <a href="#" class="text-white hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export { Navbar };
