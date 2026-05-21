import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
    setMsg(res.data.message || "OTP sent successfully");
    setStep(2);
  } catch (err) {
    setMsg(err.response?.data?.message || "Error sending OTP");
  }
};

  const resetPassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-6 rounded-lg w-96">

        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        {msg && <p className="text-sm mb-3 text-teal-400">{msg}</p>}

        {step === 1 && (
          <>
            <input
              className="w-full p-2 rounded text-black mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendOtp} className="w-full bg-teal-500 p-2 rounded">
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="w-full p-2 rounded text-black mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              className="w-full p-2 rounded text-black mb-3"
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={resetPassword} className="w-full bg-teal-500 p-2 rounded">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
