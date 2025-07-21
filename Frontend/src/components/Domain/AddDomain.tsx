import axios from "axios";
import { useState } from "react";
import { verifyIp } from "../../utility/verifyip";
import { useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";
import Overlay from "../overlays/Overlay";
import Loader from "../overlays/Loader";
import { Toaster, toast } from "sonner";

interface Props {
  dnsName: string;
}

const AddDomain = ({ dnsName }: Props) => {
  const [publicip, setPublicip] = useState<string>("");
  const [recordType, setRecordType] = useState("");
  const [message, setMessage] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  //for overlays
  const [showOverlay, setShowOverlay] = useState(false);
  const [desc, setDesc] = useState<string>("");

  const _id = useAppSelector((state) => state.user.user?._id);
  const navigate = useNavigate();

  const handleVerifyIp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading(true);
    const result = await verifyIp(publicip, _id);
    setMessage(result.message);
    setValid(result.valid);
    console.log(result.status);
    if (result.status === 402) {
      setDesc(result.message);
      setShowOverlay(true);
      isLoading(false);
      return;
    }
    isLoading(false);
  };

  const handleCreateDomain = async () => {
    try {
      isLoading(true);
      const response = await axios.post(
        `${apiUrl}/dns/create-dns`,
        {
          dnsName,
          publicIp: publicip,
          userRef: _id,
          recordType,
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setTimeout(() => navigate("/"),1000)
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Something went wrong.";
        toast.error(msg);
      }
      console.log("add domain err :", err);
    } finally {
      isLoading(false);
    }
  };
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  return (
    <div>
      {showOverlay && (
        <Overlay
          title="Access Denied"
          message={desc}
          onClose={handleCloseOverlay}
          showClose={true}
        />
      )}
      {loading && <Loader />}
      <div className="block lg:flex lg:justify-center lg:items-center bg-[#3A3633] w-full mt-20 rounded">
        <form
          className="flex justify-center items-center p-2"
          onSubmit={handleVerifyIp}
        >
          <div className="block lg:flex">
            <label
              htmlFor="domain"
              className="font-light lg:text-2xl  text-[#E5C07B]"
            >
              Sub Domain Name :
            </label>
            <input
              type="text"
              className="ml-1 p-2 bg-white rounded"
              id="domain"
              value={dnsName}
              disabled
            />
          </div>
          <div className="block lg:flex">
            <label
              htmlFor="publicip"
              className="font-light lg:text-2xl text-[#E5C07B] ml-10"
            >
              Enter Your Public IP :
            </label>
            <input
              type="text"
              className="ml-1 p-2 bg-white rounded outline-none"
              onChange={(e) => setPublicip(e.target.value)}
              id="publicip"
              disabled={valid}
              required
            />
          </div>
          <div className="block lg:flex">
            <label
              htmlFor="publicip"
              className="font-light lg:text-2xl text-[#E5C07B] ml-10"
            >
              Type :
            </label>
            <select
              className="ml-1 p-2 bg-white rounded outline-none"
              onChange={(e) => setRecordType(e.target.value)}
              id="publicip"
            >
              <option> </option>
              <option value={"A"}>A</option>
              <option value={"CNAME"}>CNAME</option>
            </select>
          </div>

          <button
            className="font-light text-white bg-green-500 px-4 py-2 rounded hover:bg-green-800 ml-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "verifying" : "verify"}
          </button>
        </form>
        <div className="text-center"></div>
      </div>
      {message && <p className="text-center mt-3 text-white">{message}</p>}
      {valid && (
        <button
          onClick={handleCreateDomain}
          className="text-center mt-3 text-white flex justify-center items-center w-full border p-3 bg-[#E5C07B] outline-none rounded text-2xl font-bold"
        >
          Add Domain, Finish up!
        </button>
      )}
      {valid && (
        <p className="hidden sm:block text-center mt-5 text-white">
          Big button, big move—let’s go!
        </p>
      )}
      <Toaster richColors/>
    </div>
  );
};

export default AddDomain;
