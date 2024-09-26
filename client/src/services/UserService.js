import axios from "axios";
const axiosJWT = axios.create();
export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/login`,
    data
  );
  return res.data;
};
export const logoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/logout`
  );
  return res.data;
};
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
export const deleteUser = async (id) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/api/user/delete/${id}`
  );
  return res.data;
};
export const deleteManyUser = async (ids) => {
  const res = await axiosJWT.delete(
    `${
      process.env.REACT_APP_API_URL
    }/api/user/delete-many?selectedManyKeys=${ids.join(",")}`
  );
  return res.data;
};
export const getDetailsUser = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/api/user/detail/${id}`
  );
  return res.data;
};
export const updateUser = async (id, data) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/user/update/${id}`,
    data
  );
  return res.data;
};
