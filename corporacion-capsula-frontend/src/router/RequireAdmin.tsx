import { Navigate, Outlet } from "react-router-dom"
import { isAdministrator } from "../modules/auth/utils/roles"

/** Rutas que solo pueden acceder los administradores. */
const RequireAdmin = () => {
  if (!isAdministrator()) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default RequireAdmin
