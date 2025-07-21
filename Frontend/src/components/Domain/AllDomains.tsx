import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { useAppSelector } from "../../app/hook";
import { apiUrl } from "../../config";
import { verifyIp } from "../../utility/verifyip";
import Loader from "../overlays/Loader";

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
  const [dnsRecord, setDnsRecord] = useState<DnsRecord[]>([]);
  const [editId, setEditId] = useState<string>("");
  const [publicIp, setPublicIp] = useState<string>("");
  const [loading, isLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const [recordType, setRecordType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const _id = useAppSelector((state) => state.user.user?._id);

  useEffect(() => {
    const getDomains = async () => {
      if (!_id) return;
      try {
        isLoading(true);
        const response = await axios.get(`${apiUrl}/dns/userDomains`, {
          params: { _id },
          withCredentials: true,
        });
        setDnsRecord(response.data);
      } catch (err) {
        console.log(err);
      }finally{
        isLoading(false)
      }
    };

    getDomains();
  }, [_id]);

  const handleDeleteDomain = async (dnsName: string) => {
    try {
      isLoading(true);
      const response = await axios.delete(`${apiUrl}/dns/deleteDomain`, {
        data: { dnsName, _id },
        withCredentials: true,
      });
      window.location.reload();
      console.log(response.data.message); //deletion confirmation message here
    } catch (error) {
      console.log(error);
    }finally{
      isLoading(false)
    }
  };
  const handleVerifyIp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isLoading(true);

    const result = await verifyIp(publicIp, _id);
    console.log(result.message)//do something about this message

    setValid(result.valid);
    isLoading(false);
  };
  const handleUpdateDomain = async () => {
    try {
      isLoading(true);
      const response = await axios.post(`${apiUrl}/dns/update-domain`, {
        dnsName: name,
        recordType,
        publicIp,
        userRef: _id,
      });
      console.log(response); //any alerts
      window.location.reload();
    } catch (error) {
      console.log(error);
    }finally{
      isLoading(false)
    }
  };
  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <div className="absolute w-full p-4 mt-[45px] bg-[#2C2926] top-12">
        <div
          className={`grid ${!editId ? "grid-cols-5" : "grid-cols-6"}
         text-center border border-yellow-500 p-5`}
        >
          {loading && <Loader />}
          <p className="mr-5 text-white font-bold">Domain</p>
          <p className="mr-5 text-white font-bold">Record</p>
          <p className="mr-5 text-white font-bold">IP</p>
          <p className="mr-5 text-white font-bold">tools</p>
        </div>
        {dnsRecord.map((dns) => {
          const edit = editId === dns._id;
          return (
            <div
              key={dns._id}
              className={`grid ${
                !edit ? "grid-cols-5" : "grid-cols-6"
              } text-center border border-yellow-500 p-5`}
            >
              <p className="mr-5 text-gray-700 opacity-80 font-medium">
                {dns.dnsName}
              </p>
              {!edit ? (
                <p className="mr-5 text-gray-700 opacity-80 font-medium">
                  {dns.recordType}
                </p>
              ) : (
                <select
                  className="ml-1 p-2 bg-white rounded outline-none"
                  onChange={(e) => {
                    setRecordType(e.target.value);
                    setValid(false);
                  }}
                  id="publicip"
                  value={recordType}
                >
                  <option value={"A"}>A</option>
                  <option value={"CNAME"}>CNAME</option>
                </select>
              )}
              <input
                type="text"
                className="mr-5 text-gray-700 opacity-80 font-medium text-center"
                value={!edit ? dns.publicIp : publicIp}
                disabled={!edit}
                onChange={(e) => {
                  setPublicIp(e.target.value);
                  setValid(false);
                }}
              />
              {!edit ? (
                <>
                  <button
                    onClick={() => {
                      handleDeleteDomain(dns.dnsName);
                    }}
                    className="bg-red-500 hover:bg-red-300"
                  >
                    del
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-300"
                    onClick={() => {
                      setEditId(dns._id);
                      setPublicIp(dns.publicIp);
                      setRecordType(dns.recordType);
                      setName(dns.dnsName);
                    }}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
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
                  <button
                    disabled={!valid}
                    onClick={() => handleUpdateDomain()}
                  >
                    save
                  </button>
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    cancel
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllDomains;
