import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import Home from "../modules/home/pages/Home"
import ArtefactosList from "../modules/artefactos/pages/ArtefactosList"
import ArtefactoCreate from "../modules/artefactos/pages/ArtefactoCreate"
import ArtefactoEdit from "../modules/artefactos/pages/ArtefactoEdit"
import ArtefactoEliminar from "../modules/artefactos/pages/ArtefactoEliminar"

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
        </Route>

      </Routes>
    </BrowserRouter>
  )
}