import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Loading from "./Loading";

export default function PrivateRoute() {
  const [auth] = useAuth(); // context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authCheck = async () => {
      const { data } = await axios.get(`/auth-check`);
      if (data.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return isLoggedIn ? <Outlet /> : <Loading />;
}

// useEffect(() => {
//   if (auth?.token) {
//     setIsLoggedIn(true);
//   } else {
//     setIsLoggedIn(false);
//   }
// }, [auth?.token]);
