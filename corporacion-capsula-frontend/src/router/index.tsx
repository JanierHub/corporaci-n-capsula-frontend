import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import Home from "../modules/home/pages/Home"
import ArtefactosList from "../modules/artefactos/pages/ArtefactosList"
import ArtefactoCreate from "../modules/artefactos/pages/ArtefactoCreate"
import ArtefactoEdit from "../modules/artefactos/pages/ArtefactoEdit"
import ArtefactoEliminar from "../modules/artefactos/pages/ArtefactoEliminar"
import AdminPanel from "../modules/admin/pages/AdminPanel"
import UserRoles from "../modules/admin/pages/UserRoles"
import Auditoria from "../modules/auditoria/pages/Auditoria"
import BusquedaAvanzada from "../modules/busqueda/pages/BusquedaAvanzada"
import Biometrico from "../modules/biometrico/pages/Biometrico"
import MiCapsula from "../modules/usuario/pages/MiCapsula"
import ProyectosID from "../modules/proyectos/pages/ProyectosID"
import Seguridad from "../modules/seguridad/pages/Seguridad"
import Tecnologia from "../modules/tecnologia/pages/Tecnologia"

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
          
          {/* Admin Panel - Todos los usuarios autenticados pueden ver */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Gestión de Usuarios y Roles - Solo Admin */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/users" element={<UserRoles />} />
          </Route>
          
          {/* Acceso denegado */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          
          {/* TODOS los módulos funcionales accesibles para TODOS los roles */}
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/busqueda-avanzada" element={<BusquedaAvanzada />} />
          <Route path="/biometrico" element={<Biometrico />} />
          <Route path="/mi-capsula" element={<MiCapsula />} />
          
          {/* Módulos en desarrollo - placeholders */}
          <Route path="/proyectos" element={<ProyectosID />} />
          <Route path="/seguridad" element={<Seguridad />} />
          <Route path="/tecnologia" element={<Tecnologia />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}