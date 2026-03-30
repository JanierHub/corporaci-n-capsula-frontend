import axios from "axios"
import { API_URL } from "../../../config/api"


export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/user`)
  return response.data
}


export const createUser = async (data: {
  name: string
  email: string
  password: string
}) => {
  const response = await axios.post(`${API_URL}/user`, data)
  return response.data
}