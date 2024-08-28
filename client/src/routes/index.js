import HomePage from "../pages/HomePage/HomePage";
import NotPoundPage from "../pages/NotFoundPage/NotPoundPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotPoundPage,
    isShowHeader: false,
  },
];
