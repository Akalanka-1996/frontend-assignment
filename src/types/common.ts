export type CommonResponseType = {
  status: "SUCCESS" | "FAIL";
  message: string | null;
  data: unknown;
};
