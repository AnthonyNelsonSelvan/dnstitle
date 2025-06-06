import { useState } from "react";
import "./index.css";
import axios from "axios";
import { apiUrl } from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/password/forgot-password`,
        { email: email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return setMessage(response.data.message);
      }
    } catch (err: unknown) {
      setError(true);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Something went wrong");
      } else {
        setMessage("Unexpected error occurred");
      }
    }
  };
  return (
    <div>
      {message && (
        <p
          className={`text-center w-100vw top-0 ${
            error ? "text-red-800 bg-red-400" : "text-green-500 bg-green-300"
          }`}
        >
          {message}
        </p>
      )}
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-60 rounded bg-[#2C2926] shadow p-5">
          <form className="space-y-2" onSubmit={handleForgotPassword}>
            <h1 className="font-bold text-[#F5F3EE] test-2xl">
              Account recovery
            </h1>
            <label htmlFor="email" className="inputTitle">
              Enter email of your Account :
            </label>
            <input
              type="text"
              id="email"
              className="inputBox"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email address"
              required
            />
            <p className="text-gray-700 text-center">
              You will receive reset password link in your email.
            </p>
            <input type="submit" value={"Next"} className="btn" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
