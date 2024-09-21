import AdminPage from "../pages/Admin/AdminPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";
import TaskPage from "../pages/UserPage/TaskPage/TaskPage";
import UserPage from "../pages/UserPage/UserPage";

export const routes = [
  {
    path: "/admin",
    page: AdminPage,
  },
  {
    path: "/user",
    page: UserPage,
  },
  {
    path: "/task",
    page: TaskPage,
  },
  {
    path: "/login",
    page: LoginPage,
  },
  {
    path: "*",
    page: NotPoundPage,
  },
];
