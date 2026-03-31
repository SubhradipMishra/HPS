import axios from "axios";

// Simple Base API Instance
const API = axios.create({
  baseURL: "http://localhost:7070",
  withCredentials: true, // needed for AuthToken cookie
});

export default API;