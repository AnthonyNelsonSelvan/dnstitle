import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyPage = () => {
  const [message, setMessage] = useState<string>("");
  const { email, token } = useParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const response = await axios.post(
          `http://test.anthony.live/api/security/is-email-verified/${email}/${token}`
        );
        setMessage(response.data.message);
      } catch (error) {
        console.log(error);
        setMessage("Something went Wrong.");
      }
    };
    handleEmailVerification();
  }, [email, token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {message && (
          <p className="text-2xl font-semibold text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
