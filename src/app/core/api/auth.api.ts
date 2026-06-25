import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullname: string;
}

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await api.post(
    "/auth/login",
    payload
  );

  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logout = async () => {
  const refreshToken =
    localStorage.getItem("refreshToken");

  if (!refreshToken) return;

  await api.post("/auth/logout", {
    refreshToken,
  });
};


export const refreshToken = async (
  refreshToken: string
) => {
  const { data } = await api.post(
    "/auth/refresh-token",
    {
      refreshToken,
    }
  );

  return data;
};

