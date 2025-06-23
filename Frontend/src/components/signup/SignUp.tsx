import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";
import { AxiosError } from "axios";
import checkPasswordStrength from "../../utility/checkPasswordStrength";

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
}

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");
  const [serror, setSerror] = useState<string>("");
  const [passStrength, setPassStrength] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [merror, setMerror] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const passwordStrength = () => {
      const response = checkPasswordStrength(password);
      if (password.length === 0) return setValid(false);
      if (2 >= response.score) {
        setPassStrength("Try Some Stronger Password.");
        setValid(false);
        return;
      }
      setPassStrength("");
      setValid(true);
    };
    passwordStrength();
  }, [password]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<SuccessResponse>(
        `${apiUrl}/user/signup`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Response:", response.data.message);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.log("Axios Error:", axiosError);

      if (axiosError.response?.data?.message) {
        setSerror(axiosError.response.data.message);
      } else {
        setSerror("Something went wrong. Please try again.");
      }
    }
  };

  const handleVerifyEmailButton = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${apiUrl}/security/email-verification`,
        { email: email }
      );
      if (response.status === 201) {
        setVerified(true);
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      setMerror(true);
      setMessage(axiosError.response?.data.message || "Something went Wrong");
    }
  };

  const checkPassword = () => {
    if (password !== cpassword) {
      setError(true);
    } else {
      setError(false);
    }
  };
  return (
    <div>
      {message && (
        <p
          className={`text-center w-100vw top-0 ${
            merror ? "text-red-800 bg-red-400" : "text-green-500 bg-green-300"
          }`}
        >
          {message}
        </p>
      )}
      {serror && <p className="top-0 bg-amber-50 text-center">{serror}</p>}
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-142 rounded bg-[#2C2926] shadow p-6">
          <form className="space-y-4" onSubmit={handleSignUp}>
            <h1 className="mb-5 rounded font-bold text-3xl text-center font- text-[#E5C07B] p-5">
              Sign-Up
            </h1>

            <div>
              <label htmlFor="email" className="inputTitle block mb-1">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  id="email"
                  className="inputBox flex-1"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-white transition duration-200 ${
                    verified
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={(e) => handleVerifyEmailButton(e)}
                  disabled={verified}
                >
                  {verified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>
            <label htmlFor="password" className="inputTitle">
              Set Password
            </label>
            <input
              type="password"
              id="password"
              className="inputBox"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              onKeyUp={checkPassword}
              required
            />
            {error && <p className="text-center">password does not match</p>}
            <input
              type="submit"
              value={"Sign Up"}
              className="btn"
              disabled={!valid || error || !verified}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
