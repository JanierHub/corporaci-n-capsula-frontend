import { api } from "../../../config/api";

export const login = async (data: {
  userId: string;
  password: string;
  authHash: string;
}) => {
  const res = await api.post("/auth/login", data);

  return {
    role: res.data.data,
    message: res.data.message,
  };
};