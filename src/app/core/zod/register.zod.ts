import { z } from "zod";

export const RegisterSchema = z
  .object({
    first_user_name: z.string().min(1, "First name is required"),
    last_user_name: z.string().min(1, "Last name is required"),
    user_email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),
    user_password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Password must be at least 6 characters long, contain at least one uppercase letter and one number"
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
    // role: z.enum(["student", "instructor"], {
    //   required_error: "Role is required",
    // }),
    // date_of_birth: z.string().min(1, "Date of birth is required"),
    // captcha_code: z.string().min(1, "Captcha code is required"),
  })
  .refine((data) => data.user_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
