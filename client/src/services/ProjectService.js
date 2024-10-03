import axios from "axios";
// const axiosJWT = axios.create();
export const getAllProject = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/project/getall`
  );
  return res.data;
};
export const createProject = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/project/create`,
    data
  );
  return res.data;
};
export const deleteProject = async (projectId) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/project/delete/${projectId}`
  );
  return res.data;
};
export const updateProject = async (projectId, data) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/project/update/${projectId}`,
    data
  );
  return res.data;
};
export const getDetailProjectProject = async (projectId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/project/detail/${projectId}`
  );
  return res.data;
};
