import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { useAppSelector } from "../../app/hook";
import { apiUrl } from "../../config";

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

const AllDomains = () => {
  const [dnsRecord,setDnsRecord] = useState<DnsRecord[]>([])
  const _id = useAppSelector((state) => state.user.user?._id);

  useEffect(() => {
    if (!_id) return;

    const getDomains = async () => {
      try {
        console.log("req with", _id);
        const response = await axios.get(
          `${apiUrl}/dns/userDomains`,
          {
            params: { _id },
            withCredentials: true,
          }
        );
        setDnsRecord(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getDomains();
  }, [_id]);
  console.log(dnsRecord)
  return (
    <>
      <Navbar />
      <div className="absolute w-full p-4 mt-[45px] bg-[#2C2926] top-12">
        <div className="grid grid-cols-3 text-center border border-yellow-500 p-5">
          <p className="mr-5 text-white font-bold ">Domain</p>
          <p className="mr-5 text-white font-bold ">Record</p>
          <p className="mr-5 text-white font-bold ">IP</p>
        </div>
        {dnsRecord.map((dns) => {
          return (
          <div key={dns._id} className="grid grid-cols-3 text-center border border-yellow-500 p-5">
          <p className="mr-5 text-gray-700 opacity-80 font-medium">{dns.dnsName}</p>
          <p className="mr-5 text-gray-700 opacity-80 font-medium">{dns.recordType}</p>
          <p className="mr-5 text-gray-700 opacity-80 font-medium">{dns.publicIp}</p>
          </div>)
        })}
      </div>
    </>
  );
};

export default AllDomains;
