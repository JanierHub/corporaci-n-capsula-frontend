import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import { isAuthenticated } from "../utils/roles"

const Login = () => {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />
  }
  return <LoginForm />
}

export default Login