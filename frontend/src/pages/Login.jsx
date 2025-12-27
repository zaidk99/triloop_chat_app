import { useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { PiScribbleLoopThin } from "react-icons/pi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { tokenUtils } from "../utils/tokenUtils";

const Login = () => {
  // const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [focus, setFocus] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // const res = await axios.post(`${BASE_URL}/auth/login`, form, {
      //    withCredentials: true,
      // });
  
      const res = await axiosInstance.post("/auth/login",form);

      // localStorage.setItem("user", JSON.stringify(res.data.user));

      tokenUtils.setAuth(res.data.token , res.data.user);
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      if (err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login Failed .");
      }
    }
  };

  const handleFocus = (field) => {
    setFocus((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocus((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-screen flex items-center font-montserrat-regular relative bg-white">
      <header
        className="
          absolute top-6 left-1/2 -translate-x-1/2
          flex items-center gap-4 z-50
          lg:left-8 lg:translate-x-0
        "
      >
        <PiScribbleLoopThin className="w-10 h-10" />
        <span className="text-lg font-semibold">triloop</span>
      </header>
      {/* Form: Centered on sm/md, left on lg */}
      <form
        onSubmit={handleLogin}
        className="
          p-10 pt-2 w-128 rounded-2xl
          mx-auto
          lg:ml-20 lg:mx-0
        "
      >
        <div className="text-center lg:text-left">
          <h2 className="text-4xl mb-6 mt-1 font-extrabold ">Login</h2>
          <p className="text-[#969696] text-lg font-normal mb-8">
            Login to message and chat !
            {error && (
              <div>
                <p className=" text-red-600 font-bold text-sm">{error}</p>
              </div>
            )}
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="email"
            name="email"
            placeholder={focus.email ? "" : "Email"}
            value={form.email}
            onChange={handleChange}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            required
            className="peer w-full border-2 border-gray-300 
            rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500"
          />
          {(focus.email || form.email) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none transition-all peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 0.2s" }}
              htmlFor="email"
            >
              Email
            </label>
          )}
        </div>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={focus.password ? "" : "Password"}
            value={form.password}
            onChange={handleChange}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            required
            className="peer w-full border-2 border-gray-300 
            rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500 pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide Password" : "Show password"}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          {(focus.password || form.password) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none tranistion-all peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 02s" }}
              htmlFor="password"
            >
              Password
            </label>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white 
         p-2 rounded-xl h-[54px] hover:bg-blue-600"
        >
          Log In
        </button>
        <div className="mt-5 w-fit mx-auto text-center">
          <p className="text-base font-semibold text-gray-500">
            Don't have an account ??{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
      <div className="w-[825px] h-[750px] hidden lg:flex flex-col justify-center items-center gap-6 mr-10">
        <div className="flex items-end gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-3xl">
            🧑
          </div>
          <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs">
            Hi there! Ready to chat?
          </div>
        </div>
        <div className="flex items-end gap-4 self-end">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
            Absolutely! Let's get started.
          </div>
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">
            👩
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
