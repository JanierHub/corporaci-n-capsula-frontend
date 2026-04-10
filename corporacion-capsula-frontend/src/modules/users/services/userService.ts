import { api } from "../../../config/api";

export type CreateUserDTO = {
  name: string;
  age: number;
  idrol: string;
  pass: string;
  authType: "FACIAL" | "DNA_HUMAN";
};

export const createUser = async (data: CreateUserDTO) => {
  const res = await api.post("/user", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/user");
  return res.data.data;
};