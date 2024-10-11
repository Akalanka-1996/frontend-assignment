"use server";

import axios from "@/utils/axios";

export const getLocations = async () => {
  try {
    const res = await axios.get("/api/v1/location/");

    if (res.data.status === "FAIL") {
      return [];
    }

    return res.data.data;
  } catch (error) {
    console.error(error);

    return [];
  }
};
