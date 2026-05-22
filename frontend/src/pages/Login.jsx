import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      login(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-teal-500 text-white"
      }`}
    >
      {/* CARD */}
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors ${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p
          className={`text-center mt-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Login to continue SkillSwap
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {error && (
            <div
              className={`text-sm text-center ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className={`w-full mt-1 px-4 py-3 rounded-xl transition-colors outline-none border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className={`w-full mt-1 px-4 py-3 rounded-xl transition-colors outline-none border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />
            <div className="text-left mt-2 mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-teal-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className={`w-full py-3 rounded-xl font-semibold transition ${
              darkMode
                ? "bg-teal-600 hover:bg-teal-500 text-white"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 bg-white hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        </form>

        {/* SIGN UP LINK */}
        <p
          className={`text-center text-sm mt-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Don’t have an account?
          <Link to="/register" className="text-teal-500 font-medium ml-1 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;