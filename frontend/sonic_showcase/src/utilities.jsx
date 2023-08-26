import axios from "axios";

export const api = axios.create({
  baseURL: "https://sonicshowcase.com/api/v1/",
  withCredentials: true,
});
