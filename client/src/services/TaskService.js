import axios from "axios";
// const axiosJWT = axios.create();
export const getAllTask = async (projectId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/task/getall`,
    {
      params: { projectId }, // Gửi projectId dưới dạng query parameter
    }
  );
  return res.data;
};
export const addTask = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/task/create`,
    data
  );
  return res.data;
};
export const getDetailTask = async (taskId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/task/detail/${taskId}`
  );
  return res.data;
};
export const updateTask = async (taskId, data, subtasks) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/task/update/${taskId}`,
    { ...data, subtasks }
  );
  return res.data;
};
