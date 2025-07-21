import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../overlays/Loader";

const VerifyPage = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, isLoading] = useState<boolean>(false)
  const { email, token } = useParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        isLoading(true)
        const response = await axios.post(
          `http://test.anthony.live/api/security/is-email-verified/${email}/${token}`
        );
        setMessage(response.data.message);
      } catch (error) {
        console.log(error);
        setMessage("Something went Wrong.");
      }finally{
        isLoading(false)
      }
    };
    handleEmailVerification();
  }, [email, token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading && <Loader />}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {message && (
          <p className="text-2xl font-semibold text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
