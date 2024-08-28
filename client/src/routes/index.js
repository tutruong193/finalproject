import HomePage from "../pages/HomePage/HomePage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowSider: true,
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowSider: true,
  },
  {
    path: "*",
    page: NotPoundPage,
    isShowHeader: false,
  },
];
