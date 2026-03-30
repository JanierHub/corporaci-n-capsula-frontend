import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}