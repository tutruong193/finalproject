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
export const createTask = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/task/create`,
    data
  );
  return res.data;
};
export const deleteTask = async (taskIds) => {
  console.log(taskIds);
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/task/delete/`,
    {
      data: { taskIds }
    }
  );
  return res.data;
};
export const deleteSubTask = async (taskId, subtaskId) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/task/delete/task/${taskId}/subtask/${subtaskId}`
  );
  return res.data;
};
export const addSubTask = async (task_id, data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/task/create-subtask/${task_id}`,
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
export const updateStatusSubtask = async (
  taskId,
  subtaskId,
  userId,
  status
) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/task/update_status/task/${taskId}/subtask/${subtaskId}/user/${userId}`,
    { status }
  );
  return res.data;
};
export const updateStatusTask = async (taskId, userId, status) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/task/update_status/task/${taskId}/user/${userId}`,
    { status }
  );
  return res.data;
};
