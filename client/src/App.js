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
                ) : route.path === "/login" ? (
                  <Fragment>
                    <route.page />
                  </Fragment>
                ) : (
                  <Fragment>
                    <DefaultComponent
                      style={{
                        marginLeft: route.isShowSider ? "17%" : "0", 
                        marginTop: route.isShowHeader ? "60px" : "0", 
                        backgroundColor: "white"
                      }}
                      showHeader={route.isShowHeader}
                      showSider={route.isShowSider}
                    >
                      <route.page />
                    </DefaultComponent>
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
