import axios from "axios";
const axiosJWT = axios.create();
export const getAllUser = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/user/getall`
  );
  return res.data;
};
export const createUser = async (data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/api/user/create`,
    data
    // ,{
    //   headers: {
    //     token: `Bearer ${access_token}`,
    //   },
    // }
  );
  return res.data;
};
