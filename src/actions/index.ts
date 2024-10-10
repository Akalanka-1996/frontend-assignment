"use server";

import axios from "@/utils/axios";

type AuthResponseType = {
  status: "SUCCESS" | "FAIL";
  message: string | null;
  data: {
    access_token: string;
    refresh_token: string;
  } | null;
};

type SignUpData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export const signUp = async (data: SignUpData): Promise<AuthResponseType> => {
  try {
    const res = await axios.post("/api/v1/user", data);
    return res.data;
  } catch (error) {
    console.error(error);

    return error as AuthResponseType;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponseType> => {
  try {
    const res = await axios.post("api/v1/user/login", { email, password });
    return res.data;
  } catch (error) {
    console.error(error);

    return error as AuthResponseType;
  }
};
