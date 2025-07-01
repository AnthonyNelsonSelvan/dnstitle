import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../../config";
import { useAppSelector } from "../../app/hook";
import Navbar from "../navbar/Navbar";

const GenerateKey = () => {
  const [authKey, setAuthKey] = useState<string>("");
  const _id = useAppSelector((state) => state.user.user?._id);

  console.log(_id);

  useEffect(() => {
    if (!_id) return;
    console.log(_id);
    const handleFetchAuthKey = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/security/get-web-verify-key/${_id}`
        );
        if (response.status === 200) setAuthKey(response.data.secret);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchAuthKey();
  }, [_id]);

  const handleGenerateKey = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/security/generate-key/${_id}`
      );
      if (response.status === 200) {
        setAuthKey(response.data.secret);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="h-screen flex justify-center items-center ">
        <div className="w-[300px]">
          <div className="inputBox flex flex-col gap-2 ">
            <input
              type="text"
              value={authKey || ""}
              disabled
              className="inputBox"
            />
            <button
              className="btn"
              onClick={handleGenerateKey}
            >
              Generate Key
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default GenerateKey;
