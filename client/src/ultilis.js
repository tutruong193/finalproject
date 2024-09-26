import { jwtDecode } from "jwt-decode";
export const jwtTranslate = (cookiesAccessToken) => {
  if (!cookiesAccessToken) {
    console.log("Invalid access token");
    return null;
  }
  try {
    const decodedToken = jwtDecode(cookiesAccessToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};
