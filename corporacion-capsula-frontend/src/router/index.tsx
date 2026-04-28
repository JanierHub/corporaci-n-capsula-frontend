import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import Home from "../modules/home/pages/Home"
import ArtefactosList from "../modules/artefactos/pages/ArtefactosList"
import ArtefactoCreate from "../modules/artefactos/pages/ArtefactoCreate"
import ArtefactoEdit from "../modules/artefactos/pages/ArtefactoEdit"
import ArtefactoEliminar from "../modules/artefactos/pages/ArtefactoEliminar"
import AdminPanel from "../modules/admin/pages/AdminPanel"
import Auditoria from "../modules/auditoria/pages/Auditoria"
import BusquedaAvanzada from "../modules/busqueda/pages/BusquedaAvanzada"
import Biometrico from "../modules/biometrico/pages/Biometrico"
import MiCapsula from "../modules/usuario/pages/MiCapsula"

import MainLayout from "../layouts/MainLayout"
import RequireAuth from "./RequireAuth"
import RequireAdmin from "./RequireAdmin"
import RequireRole from "./RequireRole"
import AccesoDenegado from "./AccesoDenegado"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/register" element={<Register />} />

          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/artefactos" element={<ArtefactosList />} />
            <Route path="/create" element={<ArtefactoCreate />} />
            <Route path="/edit/:id" element={<ArtefactoEdit />} />
            <Route path="/artefactos/delete/:id" element={<ArtefactoEliminar />} />
          </Route>
          
          {/* Admin Panel - Todos los usuarios autenticados pueden ver, pero con restricciones */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Acceso denegado */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          
          {/* Auditoría - Solo Administrador */}
          <Route element={<RequireRole allowedRoles={["Administrador"]} moduleName="Auditoría" />}>
            <Route path="/auditoria" element={<Auditoria />} />
          </Route>
          
          {/* Búsqueda Avanzada - Accesible para todos los roles (Innovación, Tecnología, etc.) */}
          <Route path="/busqueda-avanzada" element={<BusquedaAvanzada />} />
          
          {/* Biométrico - Solo Especialista en Seguridad y Administrador */}
          <Route element={<RequireRole allowedRoles={["Especialista en seguridad", "Administrador"]} moduleName="Verificación Biométrica" />}>
            <Route path="/biometrico" element={<Biometrico />} />
          </Route>
          
          {/* Mi Cápsula - Todos los usuarios autenticados */}
          <Route path="/mi-capsula" element={<MiCapsula />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}