import { useState } from "react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import AddDomain from "./AddDomain";
import { apiUrl } from "../../config";

const Domain = () => {
  const [message, setMessage] = useState<string>("");
  const [available, setAvailable] = useState<boolean>(false);
  const [dns, setDns] = useState<string>("");
  const checkAvailability = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    try {
      const formData = new FormData(e.currentTarget);
      const dns = formData.get("dns") as string;

      if (!dns.trim()) {
        setMessage("Please enter a domain name.");
        setAvailable(false);
        return;
      }
      const response = await axios.get(
        `${apiUrl}/dns/check-availability`,
        {
          params: { dns },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setAvailable(response.status === 200);
      console.log(message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Something went wrong.";
        setMessage(msg);
      } else {
        setMessage("Unexpected error occurred.");
      }
    }
  };
  console.log(message);
  return (
    <div className="scrollbar-hidden">
      <Navbar />
      <div className="absolute w-full p-4 mt-[45px] bg-[#2C2926] top-12">
        <form method="get" onSubmit={checkAvailability}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
            <label
              htmlFor="domain"
              className="font-bold text-2xl text-[#E5C07B]"
            >
              Domain Name
            </label>
            <hr className="m-2 border-[#E5C07B]" />
            <div className="flex flex-grow items-center space-x-2">
              <input
                type="text"
                id="domain"
                className="flex-grow rounded p-2 bg-[#3A3633] text-[#F5F3EE] outline-none"
                placeholder="Enter domain..."
                name="dns"
                onChange={(e) => setDns(e.target.value)}
                disabled={available}
                required
              />
              <button
                type="submit"
                className="font-light text-white bg-green-500 px-4 py-2 rounded hover:bg-green-800"
              >
                Check Availability
              </button>
            </div>
          </div>
        </form>
        {message && (
          <p
            className={`text-center w-full ${
              available ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {available && <AddDomain dnsName={dns} />}
      </div>
    </div>
  );
};

export default Domain;
