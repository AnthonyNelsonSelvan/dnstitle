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
        { email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setError(false);
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
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      {message && (
        <p
          className={`text-center w-full max-w-md mb-4 px-4 py-2 rounded ${
            error ? "text-red-800 bg-red-300" : "text-green-800 bg-green-300"
          }`}
        >
          {message}
        </p>
      )}

      <div className="w-full max-w-md bg-[#2C2926] shadow-lg rounded-lg p-6">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-[#F5F3EE]">
            Recover Your Account
          </h1>

          <label htmlFor="email" className="inputTitle block">
            Enter your account email:
          </label>
          <input
            type="email"
            id="email"
            className="inputBox w-full"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />

          <p className="text-sm text-gray-400 text-center">
            You'll receive a password reset link if the email is valid.
          </p>

          <input
            type="submit"
            value="Send Reset Link"
            className="btn w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

