import { Navigate, Outlet, useLocation } from "react-router-dom"
import { isAuthenticated } from "../modules/auth/utils/roles"

/** Rutas que exigen haber iniciado sesión (no accesibles copiando el enlace sin login). */
const RequireAuth = () => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
