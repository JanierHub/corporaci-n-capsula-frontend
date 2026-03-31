import { useNavigate } from "react-router-dom"
import logo from "../assets/5.gif"

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-cyan-400">

      <div className="flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src={logo} className="w-10" />
          <span className="text-cyan-400 font-bold tracking-widest">
            CAPSULE CORP
          </span>
        </div>

        {/* SOLO LOGOUT */}
        <button
          onClick={() => navigate("/")}
          className="text-red-400 hover:text-red-600 transition font-bold"
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Navbar