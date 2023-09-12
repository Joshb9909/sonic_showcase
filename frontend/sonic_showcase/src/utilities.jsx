import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:8000/api/v1/",
  baseURL: "https://sonicshowcase.com/api/v1/",
  withCredentials: true,
});
