import { useEffect, useState } from "react";
import checkPasswordStrength from "../../utility/checkPasswordStrength";
import "./index.css";
import { apiUrl } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  token?: string; // '?' means could be undefined
}

const ChangePassword = ({ token }: Props) => {
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");
  const [passStrength, setPassStrength] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(true);
  const [merror, setMerror] = useState<boolean>(false); //message error
  const navigate = useNavigate();

  useEffect(() => {
    const passwordStrength = () => {
      const response = checkPasswordStrength(password);
      if (password.length === 0) return setValid(false);
      if (3 >= response.score) {
        setPassStrength("Try Some Stronger Password.");
        setValid(false);
        return;
      }
      setPassStrength("");
      setValid(true);
    };
    passwordStrength();
  }, [password]);

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/password/forgot-password/change/${token}`,
        { password: password }
      );
      setMessage(response.data.message);
      if (response.status !== 200) {
        setMerror(true);
      }
      setMerror(false);
    } catch (error) {
      console.log(error);
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
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-120 rounded bg-[#2C2926] shadow p-6">
          <form className="space-y-4" onSubmit={handleChangePassword}>
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
              value={"Change password"}
              className="btn"
              onClick={() => {navigate("/login")}}
              disabled={!valid && error}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
