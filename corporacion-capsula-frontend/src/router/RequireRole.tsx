import { Navigate, Outlet, useLocation } from "react-router-dom"
import { canAccessModule, getStoredUserRole } from "../modules/auth/utils/roles"

interface RequireRoleProps {
  allowedRoles: string[]
  moduleName: string
}

/** Protege rutas específicas por rol. Admin siempre tiene acceso. */
const RequireRole = ({ allowedRoles, moduleName }: RequireRoleProps) => {
  const location = useLocation()
  const userRole = getStoredUserRole() || "Usuario"

  if (!canAccessModule(allowedRoles)) {
    // Redirigir a página de acceso denegado con info del módulo
    return (
      <Navigate
        to="/acceso-denegado"
        state={{ from: location, moduleName, allowedRoles, userRole }}
        replace
      />
    )
  }

  return <Outlet />
}

export default RequireRole
