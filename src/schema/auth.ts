import { z } from "zod";

export const registerFormSchema = z
  .object({
    first_name: z
      .string({
        required_error: "First name is required.",
      })
      .min(2, {
        message: "First name must be at least 2 characters.",
      }),
    last_name: z
      .string({
        required_error: "Last name is required.",
      })
      .min(2, {
        message: "Last name must be at least 2 characters.",
      }),
    email: z
      .string({
        required_error: "Email is required.",
      })
      .email({
        message: "Please enter a valid email address.",
      }),
    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ -\/:-@\[-`{-~])[A-Za-z\d -\/:-@\[-`{-~]{8,16}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
        }
      ),
    retypePassword: z.string({
      required_error: "Retype password is required.",
    }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });
