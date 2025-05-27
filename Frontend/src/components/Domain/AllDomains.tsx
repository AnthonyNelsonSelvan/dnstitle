import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { useAppSelector } from "../../app/hook";
import { apiUrl } from "../../config";
import { verifyIp } from "../../utility/verifyip";

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
  const [edit, setEdit] = useState<boolean>(false)
  const [publicip, setPublicip] = useState<string>("");
  const [loading, isLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const _id = useAppSelector((state) => state.user.user?._id);

  useEffect(() => {
    if (!_id) return;

    const getDomains = async () => {
      try {
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
  
  const handleDeleteDomain = async (dnsName:string) => {
    try {
      const response = await axios.delete(`${apiUrl}/dns/deleteDomain`,{
        data : {dnsName,_id},
        withCredentials : true,
      });
      window.location.reload();
      console.log(response.data.message)//deletion confirmation message here
    } catch (error) {
      console.log(error)
    }
  };
  const handleVerifyIp = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      isLoading(true);
  
      const result = await verifyIp(publicip);
  
      setValid(result.valid);
      isLoading(false);
    };
  return (
    <>
      <Navbar />
      <div className="absolute w-full p-4 mt-[45px] bg-[#2C2926] top-12">
        <div className="grid grid-cols-5
         text-center border border-yellow-500 p-5">
          <p className="mr-5 text-white font-bold">Domain</p>
          <p className="mr-5 text-white font-bold">Record</p>
          <p className="mr-5 text-white font-bold">IP</p>
          <p className="mr-5 text-white font-bold">tools</p>
        </div>
        {dnsRecord.map((dns) => {
          return (
          <div key={dns._id} className={`grid ${!edit ? "grid-cols-5" : "grid-cols-6"} text-center border border-yellow-500 p-5`}>
          <p className="mr-5 text-gray-700 opacity-80 font-medium">{dns.dnsName}</p>
          <p className="mr-5 text-gray-700 opacity-80 font-medium">{dns.recordType}</p>
          <input type="text" className="mr-5 text-gray-700 opacity-80 font-medium text-center" value={dns.publicIp} disabled={!edit} onChange={() => setPublicip(dns.publicIp)}/>
          {!edit ? (
            <>
          <button onClick={() => {handleDeleteDomain(dns.dnsName)}} className="bg-red-500 hover:bg-red-300">del</button>
          <button className="bg-blue-500 hover:bg-blue-300" onClick={() => {setEdit(true)}}>Edit</button> 
          </>) : <>
            {loading ? (
            <button
              className="font-light text-white bg-green-500 px-4 py-2 rounded hover:bg-green-800 ml-2"
              type="submit"
            >
              verifying
            </button>
          ) : (
            <button
              className="font-light text-white bg-green-500 px-4 py-2 rounded hover:bg-green-800 ml-2"
              type="submit"
              onClick={handleVerifyIp}
            >
              verify
            </button>
          )}
            <button disabled={!valid} onClick={() => console.log("saved")}>save</button>
            <button>cancel</button>
            </>
        }
          </div>)
        })}
      </div>
    </>
  );
};

export default AllDomains;
