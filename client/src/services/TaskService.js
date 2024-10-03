import axios from "axios";
// const axiosJWT = axios.create();
export const getAllTask = async (projectId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/task/getall`,
    {
      params: { projectId }, // Gửi projectId dưới dạng query parameter
    }
  );
  console.log(projectId);
  return res.data;
};
