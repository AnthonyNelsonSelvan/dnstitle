import axios from "axios";
import { apiUrl } from "../../config";
import { useAppSelector } from "../../app/hook";

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

interface Props {
  dns: DnsRecord | null;
}

const AdminDomain = ({ dns }: Props) => {
  const _id = useAppSelector((state) => state.user.user?._id);

  const handleDeleteDomain = async (dnsName: string) => {
    try {
      await axios.delete(`${apiUrl}/dns/deleteDomain`, {
        data: { dnsName, _id },
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if(dns === null) return

  return (
    <div className="absolute w-full p-4 mt-[45px] bg-[#2C2926] top-23">
      <div className="grid grid-cols-4 text-center border border-yellow-500 p-5 font-bold text-white">
        <p>Domain</p>
        <p>Record</p>
        <p>IP</p>
        <p>Tools</p>
      </div>
        <div
          key={dns._id}
          className="grid grid-cols-4 text-center border border-yellow-500 p-5 text-gray-300"
        >
          <p>{dns.dnsName}</p>
          <p>{dns.recordType}</p>
          <p>{dns.publicIp}</p>
          <button
            onClick={() => handleDeleteDomain(dns.dnsName)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
          >
            Delete
          </button>
        </div>
    </div>
  );
};

export default AdminDomain;
