import { useEffect, useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PiScribbleLoopThin } from "react-icons/pi";
import axiosInstance from "../utils/axiosInstance";
import { tokenUtils } from "../utils/tokenUtils";

const Signup = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [focus, setFocus] = useState({
    fullName: false,
    username: false,
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [suggest, setSuggest] = useState([]);

  // useEffect(() => {
  //   if (suggest.length > 0) {
  //     console.log("Updated suggest state:", suggest);
  //   }
  // }, [suggest]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocus((prev) => ({ ...prev, [field]: true }));
  };
  const handleBlur = (field) => {
    setFocus((prev) => ({ ...prev, [field]: false }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorUsername("");
    setErrorEmail("");
    setSuggest([]);
    try {
      // const res = await axios.post(`${BASE_URL}/auth/signup`, form, {
      //   withCredentials: true,
      // });

      const res = await axiosInstance.post("/auth/signup", form);
      tokenUtils.setAuth(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (!Array.isArray(errors)) {
        console.error(err);
        return;
      }

      errors.forEach((errorObj) => {
        if (errorObj.field === "email") {
          setErrorEmail(errorObj.message);
        }

        if (errorObj.field === "username") {
          setErrorUsername(errorObj.message);
          if (Array.isArray(errorObj.suggestions)) {
            setSuggest(errorObj.suggestions);
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-white font-montserrat-regular relative">
      <header
        className="absolute top-6 flex items-center gap-4 z-50
    left-1/2
    -translate-x-1/2
    lg:left-8
    lg:translate-x-0
    "
      >
        <span className="text-lg font-semibold">triloop</span>
      </header>
      <form
        onSubmit={handleSignup}
        className=" p-16 w-[500px] mt-6 rounded-2xl lg:ml-20 lg:mx-0 mx-auto"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-4xl mb-6 mt-1 font-extrabold">Signup</h2>
          <p className="text-[#969696] text-lg font-normal mb-8 ">
            Sign up to message and chat
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            placeholder={focus.fullName ? "" : "Full Name"}
            onChange={handleChange}
            onFocus={() => handleFocus("fullName")}
            onBlur={() => handleBlur("fullName")}
            required
            className="peer w-full border-2 border-gray-300 rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500"
          />
          {(focus.fullName || form.fullName) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none transition-all
              peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 0.2s" }}
              htmlFor="fullName"
            >
              Full Name
            </label>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            name="username"
            value={form.username}
            placeholder={focus.username ? "" : "Username"}
            onChange={handleChange}
            onFocus={() => handleFocus("username")}
            onBlur={() => handleBlur("username")}
            required
            className="peer w-full border-2 border-gray-300 rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500"
          />
          {(focus.username || form.username) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none transition-all
              peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 0.2s" }}
              htmlFor="username"
            >
              Username
            </label>
          )}
        </div>
        {errorUsername && (
          <div className="p-4 pt-0 flex gap-2">
            <p className="text-red-500 text-xs">{errorUsername}</p>

            {suggest.length > 0 && (
              <div className="flex gap-2 ">
                {suggest.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm({ ...form, username: s })}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Email Field */}
        <div className="relative mb-6">
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder={focus.email ? "" : "Email"}
            onChange={handleChange}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            required
            className="peer w-full border-2 border-gray-300 rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500"
          />
          {(focus.email || form.email) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none transition-all
              peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 0.2s" }}
              htmlFor="email"
            >
              Email
            </label>
          )}
        </div>
        {errorEmail && (
          <p className="text-red-500  text-xs p-4 pt-0 ">{errorEmail}</p>
        )}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            placeholder={focus.password ? "" : "Password"}
            onChange={handleChange}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            required
            className="peer w-full border-2 border-gray-300 rounded-lg pt-4 pb-5 px-4 focus:outline-none focus:border-blue-500 pr-10"
          />
          {/* Eye icon button */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          {(focus.password || form.password) && (
            <label
              className="absolute -top-3 left-4 px-2 bg-white text-gray-400 text-lg pointer-events-none transition-all
              peer-focus:text-blue-500 peer-focus:text-base peer-not-placeholder-shown:text-base peer-not-placeholder-shown:text-blue-500"
              style={{ transition: "all 0.2s" }}
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
          Sign Up
        </button>
        <div className="mt-5 w-fit mx-auto text-center">
          <p className="text-base font-semibold text-gray-500">
            Already have an account ??{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
      <div className="w-[825px] h-[750px] hidden lg:flex flex-col justify-center items-center gap-6 mr-10">
        <div className="flex items-end gap-4 ">
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

export default Signup;
