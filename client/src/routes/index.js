import AdminPage from "../pages/Admin/AdminPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";
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
    path: "/Login",
    page: LoginPage,
  },
  {
    path: "*",
    page: NotPoundPage,
  },
];
