import axios from "axios";

const BASE_URL = "http://localhost:3001/api";
const API_GET_QUOTATIONS = `${BASE_URL}/quotations`;
const API_GET_QUOTATIONS_FILTERED = `${BASE_URL}/quotations-filtered`;
export const fetchQuotations = async () => {
  const token = JSON.parse(localStorage.getItem("token"))?.token;
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");

  if (!token) throw new Error("Token not found");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const isAdmin =
    userRole === "Admin" ||
    userRole === "SuperAdmin" ||
    userRole === "Director";

  // 🔍 Debug Log
  console.log("🔍 API Debug", {
    token,
    userRole,
    username,
    endpoint: isAdmin
      ? `${BASE_URL}/quotations`
      : `${BASE_URL}/quotations-filtered?username=${username}`,
  });

  if (isAdmin) {
    const response = await axios.get(`${BASE_URL}/quotations`, { headers });
    return response.data;
  } else {
    const response = await axios.get(`${BASE_URL}/quotations-filtered`, {
      headers,
      params: { username },
    });
    return response.data;
  }
};
