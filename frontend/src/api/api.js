import axios from "axios";

// Simple Base API Instance
const API = axios.create({
  baseURL: "https://hps-j8xl.onrender.com",
  withCredentials: true, // needed for AuthToken cookie
});

export default API;