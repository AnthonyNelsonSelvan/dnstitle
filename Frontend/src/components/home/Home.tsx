import Navbar from "../navbar/Navbar";
import pic1 from "../../assets/About-dns.jpg";
import pic2 from "../../assets/pic2.jpg";
import pic3 from "../../assets/pic3.jpg";
import pic4 from "../../assets/pic4.jpg";
import "./index.css";

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
        <div className="flex justify-center items-center w-full h-55 
                lg:m-5 text-center text-[#B4A39A] text-3xl 
                shadow-2xl rounded-3xl p-4 m-5 
                border-t-4 border-l-0 border-r-4 border-b-0 
                border-white border-opacity-40 
                bg-gradient-to-br from-[#1E1B18] to-[#B4A39A]/10">
          <p>
            "Host your website, portfolio, or app with a free subdomain. No
            hidden fees!"
          </p>
        </div>
      </div>
      <div className="flex mt-5 md:mt-10 justify-center items-center w-full text-center">
        <a href="/domain">
          <button className="m-2 p-5 bg-red-600 font-bold rounded-2xl text-white flex hover:bg-red-800">
            Get Sub-domains for free
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 place-items-center mt-20">
        <div className="text-center bg-[#eeeede] w-150 h-auto rounded font-bold m-15">
          <img
            src={pic1}
            className="w-full h-60 object-cover rounded shadow"
          ></img>
          <h1 className="text-3xl underline">About</h1>
          <p className="p-5">
            At DnsTitle, we believe that creating an online presence should be
            simple, accessible, and free. Whether you're a developer,
            entrepreneur, or creative professional, our platform provides free
            subdomains to help you bring your ideas to life—without hidden costs
            or complicated setups.
          </p>
        </div>
        <div className="text-center bg-[#F5F5DC] w-150 m-15 h-auto rounded font-bold ">
          <img
            src={pic2}
            className="w-full h-60 object-cover rounded shadow"
          ></img>
          <h1 className="text-3xl underline">Our Mission</h1>
          <p className="p-5">
            Our goal is to empower individuals and businesses by offering a
            seamless way to establish an online identity. We understand the
            importance of having a unique and reliable web address, and we make
            it easy for you to claim one, instantly.
          </p>
        </div>
        <div className="text-center bg-[#F5F5DC] w-150 m-15 h-auto rounded font-bold">
          <img
            src={pic3}
            className="w-full h-60 object-cover rounded shadow"
          ></img>
          <h1 className="text-3xl underline">Why Choose DnsTitle?</h1>
          <ul className="list-disc p-5 pl-10 text-left">
            <li>100% Free, Forever – No subscriptions, no hidden fees.</li>
            <li>
              Instant Activation – Get your subdomain up and running in seconds.
            </li>
            <li>
              Reliable & Secure – Optimized for performance and stability.
            </li>
            <li>
              Customizable & Versatile – Perfect for personal websites,
              portfolios, startups, and experimental projects.
            </li>
            <li>
              User-Friendly – No technical expertise required; just choose your
              subdomain and start using it.
            </li>
          </ul>
        </div>
        <div className="text-center bg-[#F5F5DC] w-150 m-15 h-auto rounded font-bold">
          <img src={pic4} className="w-full h-60 object-cover rounded shadow" />
          <h1 className="text-3xl underline">Get Started Today</h1>
          <p className="p-5">
            With DnsTitle, you can claim a free subdomain and take the first
            step toward building your online presence. Whether you need a site
            for a project, a personal blog, or an app, we’ve got you covered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
