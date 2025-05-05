import axios from "axios";
import { useState } from "react";
import { AxiosError } from "axios";
import { useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";

interface Props {
  dnsName: string;
}

const AddDomain = ({dnsName} : Props) => {
  const [publicip, setPublicip] = useState<string>("");
  const [recordType,setRecordType] = useState("")
  const [message, setMessage] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const _id = useAppSelector((state) => state.user.user?._id)
  const navigate = useNavigate();

    const handleVerifyIp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/dns/verify-ip`, {
        params: { publicip },
        withCredentials: true,
      });
      setMessage(response.data.message);
      setValid(response.status === 200);
      isLoading(false);
    } catch (err: unknown) {
      isLoading(false);
      const error = err as AxiosError<{ message: string }>;

      console.log("Something went wrong:", error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        isLoading(false);
        setMessage("Failed to verify IP. Please try again later.");
      }
      setValid(false);
    }
  };
  const handleCreateDomain = async() =>{
    try {
      const response = await axios.post(`${apiUrl}/dns/create-dns`,{
        dnsName,
        publicIp : publicip,
        userRef :_id,
        recordType
      },{withCredentials : true})
      if(response.status === 200){
        navigate("/");
      }
    } catch (error) {
      console.log("add domain err :",error)
    }
  }
  return (
    <div>
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
            >
              verify
            </button>
          )}
        </form>
        <div className="text-center"></div>
      </div>
      {message && <p className="text-center mt-3 text-white">{message}</p>}
      {valid && (
        <button onClick={handleCreateDomain} className="text-center mt-3 text-white flex justify-center items-center w-full border p-3 bg-[#E5C07B] outline-none rounded text-2xl font-bold">
          Add Domain, Finish up!
        </button>
      )}
      {valid && (
        <p className="hidden sm:block text-center mt-5 text-white">
          Big button, big move—let’s go!
        </p>
      )}
    </div>
  );
};

export default AddDomain;
