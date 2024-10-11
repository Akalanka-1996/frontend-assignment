"use server";

import axios from "axios";

import type { CommonResponseType } from "@/types/common";
import { getSession } from "@/lib/authenticaton";

const axiosService = () => {
  const defaultOptions = {
    baseURL: process.env.API_URL,
    timeout: 10000,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      request.headers.Authorization = `Bearer ${session.user.token}`
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      return Promise.reject(error.response?.data as CommonResponseType);
    }
  );

  return instance;
};

export default axiosService();