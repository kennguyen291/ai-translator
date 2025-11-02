import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://u8tcq5rvi3.execute-api.ap-southeast-2.amazonaws.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const awsDevClient = axios.create({
  baseURL: "https://4sxz16u8w1.execute-api.ap-southeast-2.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});
