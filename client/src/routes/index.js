import AccountPage from "../pages/Admin/AccountPage/AccountPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";
import ListPage from "../pages/UserPage/ListPage/ListPage";
import BoardPage from "../pages/UserPage/BoardPage/BoardPage";
import UserManagerProjectPage from "../pages/UserPage/UserManageProjectPage/UserManagerProjectPage";
import UserNotificationPage from "../pages/UserPage/UserNotificationPage/UserNotificationPage";

export const routes = [
  {
    path: "/system/admin/accounts",
    page: AccountPage,
    isShowHeader: true,
    isShowSider: true,
    requiresAuth: true,
  },
  {
    path: "/system/user/your-work",
    page: UserManagerProjectPage,
    isShowHeader: true,
    requiresAuth: true,
    isShowSider: false,
  },
  {
    path: "/system/user/project/list",
    page: ListPage,
    isShowHeader: true,
    requiresAuth: true,
    isShowSider: true,
  },
  {
    path: "/system/user/project/board",
    page: BoardPage,
    isShowHeader: true,
    requiresAuth: true,
    isShowSider: true,
  },
  {
    path: "/system/user/notification", // Add this route
    page: UserNotificationPage,
    isShowHeader: true,
    requiresAuth: true,
    isShowSider: true,
  },
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: false,
    requiresAuth: false,
    isShowSider: false,
  },
  {
    path: "*",
    page: NotPoundPage,
    isShowHeader: false,
    requiresAuth: false,
    isShowSider: false,
  },
];
