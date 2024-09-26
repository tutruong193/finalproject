import AdminPage from "../pages/Admin/AdminPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";
import TaskPage from "../pages/UserPage/TaskPage/TaskPage";
import UserPage from "../pages/UserPage/UserPage";

export const routes = [
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: true,
    requiresAuth: true,
  },
  {
    path: "/system/user",
    page: UserPage,
    isShowHeader: true,
    requiresAuth: true,
  },
  {
    path: "/system/task",
    page: TaskPage,
    isShowHeader: true,
    requiresAuth: true,
  },
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: false,
    requiresAuth: false,
  },
  {
    path: "*",
    page: NotPoundPage,
    isShowHeader: false,
    requiresAuth: false,
  },
];
