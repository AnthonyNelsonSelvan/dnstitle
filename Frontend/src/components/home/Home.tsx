import Navbar from "../navbar/Navbar";
import "./index.css";
import CardGrid from "../CardGrid/CardGrid";
import { Footer } from "./Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="scrollbar-hidden"></div>
      <div className="block text-center lg:flex justify-between items-center mt-20">
        <div className="w-full h-55 m-10 mt-30 p-6 text-center">
          <h1 className="text-white font-extrabold text-7xl">
            Get Your Own Free Subdomain
          </h1>
          <p className="text-gray-400 text-2xl">
            Free Subdomains. Unlimited Possibilities.
          </p>
        </div>
        <div
          className="flex justify-center items-center w-full h-55 
                lg:m-5 text-center text-[#B4A39A] text-3xl 
                shadow-2xl rounded-3xl p-4 m-5 
                border-t-4 border-l-0 border-r-4 border-b-0 
                border-white border-opacity-40 
                bg-gradient-to-br from-[#1E1B18] to-[#B4A39A]/10"
        >
          <p>
            "Host your website, portfolio, or app with a free subdomain. No
            hidden fees!"
          </p>
        </div>
      </div>
      <div className="flex mt-5 md:mt-10 justify-center items-center w-full text-center">
        <a href="/domain">
          <button className="m-4 px-6 py-4 bg-red-600 font-bold rounded-2xl text-white flex items-center justify-center shadow-md hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out">
            Get Sub-domains for Free
          </button>
        </a>
      </div>
      <div
        className="group w-full h-auto mt-10 mb-10 p-6 transition-all duration-700 ease-in-out shadow
lg:bg-white bg-[#1E1B18] lg:hover:bg-[#1E1B18] lg:mt-60"
      >
        <h2
          className="decor-text text-blue-500 relative overflow-hidden 
                   before:absolute before:top-1/2 before:left-0 
                   before:h-[6px] before:bg-red-500 before:transition-all 
                   before:duration-500 before:ease-in-out 
                   w-full sm:before:w-full lg:before:w-0 
                   lg:group-hover:before:w-full"
        >
          #Pay For A Name
        </h2>
        <h1 className="decor-text decoration-blue-500 text-white mt-10">
          #Completely Free
        </h1>
      </div>
      <CardGrid />
      <Footer />
    </div>
  );
};

export default Home;
