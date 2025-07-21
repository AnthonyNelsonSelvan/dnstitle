import { useEffect, useState } from "react";
import checkPasswordStrength from "../../utility/checkPasswordStrength";
import "./index.css";
import { apiUrl } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../overlays/Loader";
import {Toaster,toast} from "sonner"

interface Props {
  token?: string;
}

const ChangePassword = ({ token }: Props) => {
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [passStrength, setPassStrength] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);
  const [merror, setMerror] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check password strength
  useEffect(() => {
    const response = checkPasswordStrength(password);
    if (!password) {
      setValid(false);
      return;
    }
    if (response.score < 3) {
      setPassStrength("Try a stronger password.");
      setValid(false);
    } else {
      setPassStrength("");
      setValid(true);
    }
  }, [password]);

  // Check password match
  useEffect(() => {
    setError(password !== cpassword);
  }, [password, cpassword]);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing token.");
      setMerror(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/password/forgot-password/change/${token}`,
        { password }
      );
      setMerror(false);
      toast.success(response.data.message)
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMerror(true);
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Something went wrong."
        toast.error(msg)
      } else {
        toast.error("Unexpected error")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      {loading && <Loader />}
      {message && (
        <p
          className={`text-center w-full top-0 px-4 py-2 ${
            merror ? "text-red-800 bg-red-300" : "text-green-800 bg-green-300"
          }`}
        >
          {message}
        </p>
      )}
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-auto rounded bg-[#2C2926] shadow p-6">
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <h2 className="text-xl font-bold text-center text-[#E5C07B]">
              Change Password
            </h2>

            <label htmlFor="password" className="inputTitle">
              Set Password
            </label>
            <input
              type="password"
              id="password"
              className="inputBox"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {passStrength && <p className="text-red-500">{passStrength}</p>}

            <label htmlFor="cpassword" className="inputTitle">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              className="inputBox"
              onChange={(e) => setCpassword(e.target.value)}
              value={cpassword}
              required
            />
            {error && (
              <p className="text-center text-red-500">Passwords do not match</p>
            )}

            <input
              type="submit"
              value="Change Password"
              className="btn"
              disabled={!valid || error || loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
