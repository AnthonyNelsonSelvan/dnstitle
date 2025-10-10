import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl, recaptcha_site_key } from "../../config";
import checkPasswordStrength from "../../utility/checkPasswordStrength";
import Loader from "../overlays/Loader";
import { Toaster, toast } from "sonner";
import "./index.css";

interface SuccessResponse {
  message: string;
}
interface ErrorResponse {
  message: string;
}

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [passStrength, setPassStrength] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [merror, setMerror] = useState(false); // Message error
  const [valid, setValid] = useState(false);
  const [loading, isLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const passwordStrength = () => {
      const response = checkPasswordStrength(password);
      if (password.length === 0) return setValid(false);
      if (response.score <= 2) {
        setPassStrength("Try a stronger password.");
        setValid(false);
      } else {
        setPassStrength("");
        setValid(true);
      }
    };
    passwordStrength();
  }, [password]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = await window.grecaptcha.execute(recaptcha_site_key, {
        action: "signin",
      });
      const res = await axios.post(`${apiUrl}/verifyCaptcha/verify`, { token });
      if (res.data.success) {
        isLoading(true);
        const response = await axios.post<SuccessResponse>(
          `${apiUrl}/user/signup`,
          { email: email.trim(), password },
          { withCredentials: true }
        );
        toast.success(response.data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Something went wrong.";
        toast.error(msg);
      }
    } finally {
      isLoading(false);
    }
  };

  const handleVerifyEmailButton = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      isLoading(true);
      const response = await axios.post(
        `${apiUrl}/security/email-verification`,
        { email }
      );
      if (response.status === 201) setVerified(true);
      setMessage(response.data.message);
      setMerror(false);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setMessage(axiosError.response?.data.message || "Verification failed.");
      setMerror(true);
    } finally {
      isLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://test.anthony.live/api/auth/google";
  };

  useEffect(() => {
    setError(password !== cpassword);
  }, [password, cpassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
      <Toaster richColors />
      {loading && <Loader />}
      <div className="w-full max-w-md bg-[#2C2926] shadow-lg rounded-lg p-6 space-y-4">
        <form onSubmit={handleSignUp} className="space-y-4">
          <h1 className="text-3xl font-bold text-center text-[#E5C07B] mb-2">
            Sign Up
          </h1>

          {message && (
            <p
              className={`text-sm text-center px-3 py-2 rounded ${
                merror
                  ? "text-red-800 bg-red-200"
                  : "text-green-700 bg-green-200"
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <label htmlFor="email" className="inputTitle block mb-1">
              Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                className="inputBox flex-1"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleVerifyEmailButton}
                disabled={verified || !email.trim()}
                className={`px-4 py-2 rounded text-white text-sm ${
                  verified
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {verified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="inputTitle block mb-1">
              Set Password
            </label>
            <input
              type="password"
              id="password"
              className="inputBox w-full"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passStrength && (
              <p className="text-sm text-red-500 mt-1">{passStrength}</p>
            )}
          </div>

          <div>
            <label htmlFor="cpassword" className="inputTitle block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              className="inputBox w-full"
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              required
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <input
            type="submit"
            value="Sign Up"
            className="btn w-full"
            disabled={!valid || error || !verified}
          />
        </form>
        <div className="mt-4 semi-bold space-y-2 text-center">
          <p className="text-yellow-400 font-semibold">Other login methods</p>
          <p
            className="text-green-300 cursor-pointer hover:underline"
            onClick={handleGoogleLogin}
          >
            Authenticate with Google
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
