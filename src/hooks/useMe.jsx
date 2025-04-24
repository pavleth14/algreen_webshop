import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken as setTokenRedux } from "../redux/reducer/authSlice";

const useMe = () => {
  const dispatch = useDispatch();

  const fetchRefreshToken = async () => {
    try {
      const refreshResponse = await fetch('http://localhost:3333/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const { data, success } = await refreshResponse.json();
      console.log('REFRESH TOKEN DATA:', data);

      if (success) {
        console.log(data.accessToken);
        dispatch(setTokenRedux(data.accessToken)); // Update Redux store with accessToken
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    fetchRefreshToken(); // Fetch the token when the component mounts
  }, []);

  return {}; // No need to return the token itself
};

export default useMe;
