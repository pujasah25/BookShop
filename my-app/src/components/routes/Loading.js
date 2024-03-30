import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingGIF from "../../images/loading3.gif";

export default function Loading({ path = "login" }) { // giving default value as login
  const [count, setCount] = useState(3); // state
  const navigate = useNavigate(); // hooks
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount); 
    }, 1000);
    // redirect once count is equal to 0
    count === 0 &&
      navigate(`/${path}`, { // this path is by default login
        state: location.pathname,
      });
    // cleanup
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "70vh" }}
    >
      <img src={LoadingGIF} alt="Loading" style={{ width: "200px" }} />
    </div>
  );
}
