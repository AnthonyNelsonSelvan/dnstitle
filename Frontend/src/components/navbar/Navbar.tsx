import { useEffect, useState } from "react";
import { checkCookie,deleteCookie } from "../../services/auth";
import { useAppDispatch } from "../../app/hook";
import { addUser, clearUser} from "../../features/user/userSlice";

const Navbar = () => {
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      const userData = await checkCookie();
      if (!userData) {
        setAuth(false);
        setUser("");
        dispatch(clearUser());
      } else {
        const {_id,username,email} = userData.user
        setAuth(true);
        setUser(userData.user.username);
        dispatch(addUser({_id,username,email}))
      }
    };
    verifyUser();
  });
  const handleDeleteCookie =async () => {
    const status = await deleteCookie();
    if(status){
    setAuth(false);
    setUser("");
    dispatch(clearUser())
    }
    window.location.reload();
  };

  return (
    <nav className="flex justify-between item center m-5">
      <h1 className="text-5xl text-[#E5C07B] hover:scale-95 font-bold transition ease-linear">
        DnsTitle
      </h1>
      <ul className="flex justify-center items-center text-[#E5C07B]">
        {auth ? (
          <>
          <li className="mr-3 hover:text-[#d5bf96]">{user}</li>
            <li className="mr-3 hover:text-[#d5bf96]">Docs</li>
            <li className="mr-3 hover:text-[#d5bf96]"><a href="/all-domain">Domains</a></li>
            <li>
            <button
                className="border border-none bg-[#c19a6b] p-1 rounded text-[#F5F3EE] hover:text-[#e7d29f]"
                onClick={handleDeleteCookie}
              >
                Logout
              </button>
            </li>
            
          </>
        ) : (
          <li>
            <span><a href="/login">Login</a></span>
            <span><a href="/signup">/Sign-up</a></span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
