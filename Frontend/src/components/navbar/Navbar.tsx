import { useEffect, useState } from "react";
import { checkCookie, deleteCookie } from "../../services/auth";
import { useAppDispatch } from "../../app/hook";
import { addUser, clearUser } from "../../features/user/userSlice";
import Overlay from "../overlays/Overlay";
import Loader from "../overlays/Loader";

const Navbar = () => {
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  //for overlays
  const [showOverlay, setShowOverlay] = useState(false);
  const [desc, setDesc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      const userData = await checkCookie();
      if (!userData) {
        setAuth(false);
        setUser("");
        dispatch(clearUser());
        setLoading(false);
      } else {
        const { _id, username, email, isBanned,Role } = userData.user;
        setDesc(
          "Your account is permanently banned. You have breaked our rules several times."
        );
        setShowOverlay(isBanned);
        setAuth(true);
        setUser(username);
        dispatch(addUser({ _id, username, email, Role }));
        setLoading(false);
      }
    };
    verifyUser();
  },[dispatch]);
  const handleDeleteCookie = async () => {
    const status = await deleteCookie();
    if (status) {
      setAuth(false);
      setUser("");
      dispatch(clearUser());
    }
    window.location.reload();
  };


  return (
    <nav className="flex justify-between item center m-5">
      {loading && <Loader />}
      {showOverlay && (
        <Overlay
          title="Access Denied"
          message={desc}
          showClose={false}
          onLogout={handleDeleteCookie}
          showLogout={true}
        />
      )}
      <a href="/">
      <h1 className="text-5xl text-[#E5C07B] hover:scale-95 font-bold transition ease-linear">
        DnsTitle
      </h1>
      </a>
      <ul className="flex justify-center items-center text-[#E5C07B]">
        {auth ? (
          <>
            <li className="mr-3 hover:text-[#d5bf96]">{user}</li>
            <li className="mr-3 hover:text-[#d5bf96]">
              <a href="/docs/Generate-code">Docs</a>
            </li>
            <li className="mr-3 hover:text-[#d5bf96]">
              <a href="/all-domain">Domains</a>
            </li>
            <li>
              <button
                className="border border-none bg-[#c19a6b] p-1 rounded text-[#3a2f24] hover:text-[#2a2118]"
                onClick={handleDeleteCookie}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <span>
              <a href="/login">Login</a>
            </span>
            <span>
              <a href="/signup">/Sign-up</a>
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
