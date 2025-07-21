import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useAppSelector } from "../../app/hook";
import axios from "axios";
import { apiUrl } from "../../config";
import AdminDomain from "./AdminDomain";
import Unauthorized from "../overlays/Unauthorized";

interface DnsRecord {
  _id: string;
  dnsName: string;
  publicIp: string;
  recordType: string;
  userRef: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const AdminSearch = () => {
  const [dnsRecord, setDnsRecord] = useState<DnsRecord | null>(null);
  const [domainName, setDomainName] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);
  const id = useAppSelector((state) => state.user.user?._id);
  const Role = useAppSelector((state) => state.user.user?.Role);

  useEffect(() => {
    if (!(Role === "CREATOR")) {
      return setAuthorized(false);
    }
    setAuthorized(true);
  }, [Role]);

  const handleSearchDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${apiUrl}/admin/search`, {
        params: { id, domainName },
        withCredentials: true,
      });
      setDnsRecord(response.data.data);
      console.log(response.data.userData)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!authorized && <Unauthorized />}
      <Navbar />
      <form onSubmit={handleSearchDomain}>
        <div className="flex flex-grow items-center space-x-2">
          <input
            type="search"
            className="flex-grow rounded p-2 bg-[#3A3633] text-[#F5F3EE] outline-none"
            placeholder="Enter domainName"
            onChange={(e) => setDomainName(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={!domainName.trim()}
            className={`font-light text-white px-4 py-2 rounded transition-all duration-300 bg-green-500`}
          >
            Search
          </button>
        </div>
      </form>
      <AdminDomain dns={dnsRecord} />
    </div>
  );
};

export default AdminSearch;
