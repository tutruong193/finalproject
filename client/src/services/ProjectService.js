import axios from "axios";
const axiosJWT = axios.create();
export const getAllProject = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/project/getall`
  );
  return res.data;
};
