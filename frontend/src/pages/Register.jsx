import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";

const Register = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillsTeach: "",
    skillsLearn: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    skillsTeach: "",
    skillsLearn: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    skillsTeach: false,
    skillsLearn: false,
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  const validateField = (field, value) => {
    switch (field) {
      case "name": {
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      }
      case "email": {
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address (e.g. you@example.com).";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters long.";
        return "";
      }
      case "skillsTeach": {
        if (!value.trim()) return "Please add at least one skill you can teach.";
        return "";
      }
      case "skillsLearn": {
        if (!value.trim()) return "Please add at least one skill you want to learn.";
        return "";
      }
      default:
        return "";
    }
  };

  // ─── Name change: block numbers/special chars with live message ────────────

  const handleNameChange = (raw) => {
    const invalid = [...new Set((raw.match(/[^a-zA-Z\s'-]/g) || []))];
    const cleaned = raw.replace(/[^a-zA-Z\s'-]/g, "");

    if (invalid.length > 0) {
      setFieldErrors((prev) => ({
        ...prev,
        name: `"${invalid.join(", ")}" are not allowed — name can only contain letters, spaces, hyphens or apostrophes.`,
      }));
    } else if (!cleaned.trim()) {
      setFieldErrors((prev) => ({ ...prev, name: "Full name is required." }));
    } else if (cleaned.trim().length < 2) {
      setFieldErrors((prev) => ({ ...prev, name: "Name must be at least 2 characters." }));
    } else {
      setFieldErrors((prev) => ({ ...prev, name: "" }));
    }

    setForm((prev) => ({ ...prev, name: cleaned }));
  };

  // ─── Skills change: block special chars with live message ─────────────────

  const handleSkillsChange = (field, raw) => {
    const invalid = [...new Set((raw.match(/[^a-zA-Z0-9\s,.\-+#/()]/g) || []))];
    const cleaned = raw.replace(/[^a-zA-Z0-9\s,.\-+#/()]/g, "");

    if (invalid.length > 0) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `"${invalid.join(", ")}" not allowed — use letters, numbers and commas only.`,
      }));
    } else if (!cleaned.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]:
          field === "skillsTeach"
            ? "Please add at least one skill you can teach."
            : "Please add at least one skill you want to learn.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    setForm((prev) => ({ ...prev, [field]: cleaned }));
  };

  // ─── Generic change for email & password ──────────────────────────────────

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  // ─── Blur: mark touched and validate ──────────────────────────────────────

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "name") {
      if (!form.name.trim())
        setFieldErrors((prev) => ({ ...prev, name: "Full name is required." }));
      return;
    }
    if (field === "skillsTeach" || field === "skillsLearn") {
      if (!form[field].trim())
        setFieldErrors((prev) => ({
          ...prev,
          [field]:
            field === "skillsTeach"
              ? "Please add at least one skill you can teach."
              : "Please add at least one skill you want to learn.",
        }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
  };

  // ─── Password strength ─────────────────────────────────────────────────────

  const getStrength = (p) => {
    if (!p) return { label: "", color: "", width: "0%", tip: "" };
    if (p.length < 6)
      return { label: "Too short", color: "bg-red-400", width: "20%", tip: "Add more characters." };
    if (p.length < 8)
      return { label: "Weak", color: "bg-orange-400", width: "45%", tip: "Try a longer password." };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Fair", color: "bg-yellow-400", width: "70%", tip: "Add uppercase letters & numbers." };
    if (!/[^a-zA-Z0-9]/.test(p))
      return { label: "Good", color: "bg-teal-400", width: "85%", tip: "Add a symbol for a stronger password." };
    return { label: "Strong 💪", color: "bg-teal-500", width: "100%", tip: "" };
  };

  const strength = getStrength(form.password);

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const allFields = ["name", "email", "password", "skillsTeach", "skillsLearn"];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    const errors = Object.fromEntries(
      allFields.map((f) => [f, fieldErrors[f] || validateField(f, form[f])])
    );
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", form);

      // ✅ Save token + user so isLoggedIn works across the app
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile");
    } catch (err) {
      setServerError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const dm = darkMode;

  const inputClass = (field) =>
    `input input-bordered w-full mt-1 ${
      dm ? "bg-slate-700 text-white border-slate-600" : "bg-white text-gray-800"
    } ${fieldErrors[field] ? "border-red-500 focus:border-red-500" : ""}`;

  const ErrorMsg = ({ field }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        ⚠ {fieldErrors[field]}
      </p>
    ) : null;

  const HintMsg = ({ text }) => (
    <p className={`text-xs mt-1 ${dm ? "text-gray-400" : "text-gray-500"}`}>{text}</p>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    // <div
    //   className={`min-h-screen flex items-center justify-center px-6 py-10 ${
    //     dm
    //       ? "bg-slate-900 text-white"
    //       : "bg-gradient-to-br from-teal-300 via-cyan-300 to-sky-400 text-gray-900"
    //   }`}
    // >

    <div
  className={`min-h-screen flex items-center justify-center px-6 py-10 ${
    dm
      ? "bg-slate-900 text-white"
      : "bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 text-gray-900"
  }`}
>
      <div
        className={`w-full max-w-md rounded-3xl shadow-xl p-8 ${
          dm ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <h2 className={`text-3xl font-bold text-center ${dm ? "text-white" : "text-gray-800"}`}>
          Create Account
        </h2>
        <p className={`text-center mt-2 ${dm ? "text-gray-300" : "text-gray-600"}`}>
          Join SkillSwap and start sharing skills
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>

          {/* Server error */}
          {serverError && (
            <div className="alert alert-error text-sm">{serverError}</div>
          )}

          {/* ── Full Name ── */}
          <div>
            <label className={`text-sm font-medium ${dm ? "text-gray-300" : "text-gray-600"}`}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={inputClass("name")}
              placeholder="Your name (letters only)"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => handleBlur("name")}
            />
            <ErrorMsg field="name" />
            {!fieldErrors.name && (
              <HintMsg text="Only letters, spaces, hyphens and apostrophes allowed. Numbers are not allowed." />
            )}
          </div>

          {/* ── Email ── */}
          <div>
            <label className={`text-sm font-medium ${dm ? "text-gray-300" : "text-gray-600"}`}>
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className={inputClass("email")}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            <ErrorMsg field="email" />
            {!fieldErrors.email && <HintMsg text="Enter a valid email address e.g. you@example.com" />}
          </div>

          {/* ── Password ── */}
          <div>
            <label className={`text-sm font-medium ${dm ? "text-gray-300" : "text-gray-600"}`}>
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass("password") + " pr-10"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p
                  className={`text-xs mt-1 font-medium ${
                    strength.label === "Strong 💪" || strength.label === "Good"
                      ? "text-teal-500"
                      : strength.label === "Fair"
                      ? "text-yellow-500"
                      : "text-red-400"
                  }`}
                >
                  Password strength: {strength.label}
                  {strength.tip && (
                    <span className={`font-normal ml-1 ${dm ? "text-gray-400" : "text-gray-500"}`}>
                      — {strength.tip}
                    </span>
                  )}
                </p>
              </div>
            )}

            <ErrorMsg field="password" />
            {!fieldErrors.password && !form.password && (
              <HintMsg text="Minimum 6 characters. Use uppercase, numbers & symbols for a stronger password." />
            )}
          </div>

          {/* ── Skills Teach ── */}
          <div>
            <label className={`text-sm font-medium ${dm ? "text-gray-300" : "text-gray-600"}`}>
              Skills you can teach <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={inputClass("skillsTeach")}
              placeholder="e.g. React, Python, UI Design"
              value={form.skillsTeach}
              onChange={(e) => handleSkillsChange("skillsTeach", e.target.value)}
              onBlur={() => handleBlur("skillsTeach")}
            />
            <ErrorMsg field="skillsTeach" />
            {!fieldErrors.skillsTeach && (
              <HintMsg text="Required. Enter skills separated by commas e.g. React, Python, UI Design" />
            )}
          </div>

          {/* ── Skills Learn ── */}
          <div>
            <label className={`text-sm font-medium ${dm ? "text-gray-300" : "text-gray-600"}`}>
              Skills you want to learn <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={inputClass("skillsLearn")}
              placeholder="e.g. Node.js, MongoDB"
              value={form.skillsLearn}
              onChange={(e) => handleSkillsChange("skillsLearn", e.target.value)}
              onBlur={() => handleBlur("skillsLearn")}
            />
            <ErrorMsg field="skillsLearn" />
            {!fieldErrors.skillsLearn && (
              <HintMsg text="Required. Enter skills separated by commas e.g. Node.js, MongoDB" />
            )}
          </div>

          {/* ── Terms ── */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" required />
              <span className={`text-xs leading-tight ${dm ? "text-gray-300" : "text-gray-900"}`}>
                I agree to the{" "}
                <span className="text-teal-500 hover:underline cursor-pointer">terms of service</span>
                {" "}and{" "}
                <span className="text-teal-500 hover:underline cursor-pointer">privacy policy</span>
              </span>
            </label>
          </div>

          {/* ── Submit ── */}
          <button className="btn btn-neutral w-full mt-4" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-500" />
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-500" />
          </div>

          {/* ── Google ── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-500 rounded-lg py-2 bg-white text-black hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${dm ? "text-gray-300" : "text-gray-600"}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;