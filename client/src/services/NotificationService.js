import axios from "axios";
const axiosJWT = axios.create();
export const getAllNotification = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/notification/getall/${id}`
  );
  return res.data;
};
