"use server";

import type { AxiosError } from "axios";
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
      request.headers.Authorization = `Bearer ${session.user.token}`;
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const session = await getSession();

          const refreshResponse = await axios.post(
            `${process.env.BASE_URL}/api/refresh`,
            {
              refreshToken: session?.user.refreshToken,
            }
          );

          const { access_token } = refreshResponse.data.data;

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.log(refreshError);
          return Promise.reject({
            status: "FAIL",
            message: "Failed to refresh token",
            data: null,
          });
        }
      }

      console.log((error as AxiosError).response?.data);

      return Promise.reject(error.response?.data as CommonResponseType);
    }
  );

  return instance;
};

export default axiosService();
