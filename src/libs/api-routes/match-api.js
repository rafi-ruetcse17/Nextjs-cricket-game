import axios from "axios";

const api_endpoint = "/api/score";
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_API_URL });

API.interceptors.request.use((req) => {
  req.headers["Content-Type"] = "application/json";
  return req;
});

API.interceptors.response.use((res) => {
  return res;
});

// export const createScore = (payload) =>API.post("/api/createScore", payload);
// export const updateScore = (payload) =>API.patch(`/api/updateScore/${payload._id}`, payload.updatedFields)
// export const getScore = (payload) =>API.get(`/api/getScore/${payload}`);
export const createScore = (payload) => API.post(api_endpoint, payload);
export const updateScore = (payload) =>
  API.patch(api_endpoint, payload.updatedFields);
export const getScore = (payload) =>
  API.get(api_endpoint, { params: { matchId: payload } });
