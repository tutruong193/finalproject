import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { useCookies } from "react-cookie";
import { Fragment, useEffect } from "react";
import NotFoundPage from "./pages/NotFoundPage/NotPoundPage";

function App() {
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] =
    useCookies("");

  const accessToken = cookiesAccessToken.access_token;
  const isSystemPage = routes.some((route) =>
    window.location.pathname.startsWith("/system/")
  );

  useEffect(() => {
    if (!isSystemPage) {
      removeCookie("access_token");
    }
  }, [window.location.pathname]);
  return (
    <div className="App">
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.requiresAuth && !accessToken ? (
                  <Navigate to="/404" replace />
                ) : route.path === "/login" ? ( // Kiểm tra xem có phải trang login không
                  <Fragment>
                    <route.page /> {/* Render trực tiếp trang login */}
                  </Fragment>
                ) : (
                  <Fragment>
                    {route.isShowHeader && (
                      <DefaultComponent
                        style={
                          isSystemPage
                            ? { marginLeft: "17%", marginTop: "60px" }
                            : {}
                        }
                      >
                        <route.page />
                      </DefaultComponent>
                    )}
                  </Fragment>
                )
              }
            />
          ))}
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
