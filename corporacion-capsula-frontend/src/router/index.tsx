import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import Home from "../modules/home/pages/Home"
import ArtefactosList from "../modules/artefactos/pages/ArtefactosList"
import ArtefactoCreate from "../modules/artefactos/pages/ArtefactoCreate"
import ArtefactoEdit from "../modules/artefactos/pages/ArtefactoEdit"
import ArtefactoEliminar from "../modules/artefactos/pages/ArtefactoEliminar"

import MainLayout from "../layouts/MainLayout"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 SIN NAVBAR */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 CON NAVBAR */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/artefactos" element={<ArtefactosList />} />
          <Route path="/create" element={<ArtefactoCreate />} />
          <Route path="/edit/:id" element={<ArtefactoEdit />} />
          <Route path="/artefactos/delete/:id" element={<ArtefactoEliminar />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
