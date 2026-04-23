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
          
          {/* Admin Panel - Outside MainLayout for full-screen experience */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Team Modules - Outside MainLayout */}
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/busqueda-avanzada" element={<BusquedaAvanzada />} />
          <Route path="/biometrico" element={<Biometrico />} />
          
          {/* User Personal Capsule - Outside MainLayout */}
          <Route path="/mi-capsula" element={<MiCapsula />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}