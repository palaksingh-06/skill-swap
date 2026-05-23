import { useState, useEffect, useContext } from "react";
import axios from "axios";
import BasicInfo from "../components/settings/BasicInfo";
import AccountInfo from "../components/settings/AccountInfo";
import EditModal from "./EditModal";
import { DarkModeContext } from "../context/DarkModeContext";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Shield } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [editField, setEditField] = useState(null);
  const [basicData, setBasicData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const { darkMode } = useContext(DarkModeContext);
  const { user, setUser } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  /* FETCH PROFILE */
  useEffect(() => {
    if (!token) {
      setError("You are not logged in.");
      setPageLoading(false);
      return;
    }

    axios
      .get("https://skill-swap-zkfd.onrender.com/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.user;

        setBasicData({
          gender: u.gender || "",
          location: u.location || "",
          birthday: u.birthday || "",
          work: u.work || "",
          education: u.education || "",
        });

        setAccountData({
          email: u.email || "",
          password: "********",
          username: u.username || "",
          language: u.language || "English",
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile. Please try again.");
      })
      .finally(() => setPageLoading(false));
  }, [token]);

  /* SAVE FIELD */
const handleSave = async (field, value) => {
  try {
    const token = localStorage.getItem("token");

    let url = "";
    let payload = {};

    // 🔐 Password change
    if (field === "password") {
      url = "https://skill-swap-zkfd.onrender.com/api/auth/change-password";
      payload = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      };
    } 
    
    // 👤 All other updates
    else {
      url = "https://skill-swap-zkfd.onrender.com/api/user/update";
      payload = { [field]: value };
    }

    // ✅ SAVE DATA
    await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 REFETCH UPDATED USER (THIS WAS MISSING)
    const userRes = await axios.get(
      "https://skill-swap-zkfd.onrender.com/api/user/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const u = userRes.data.user;

    // ✅ UPDATE UI STATE
    setBasicData({
      gender: u.gender || "",
      location: u.location || "",
      birthday: u.birthday || "",
      work: u.work || "",
      education: u.education || "",
    });

    setAccountData({
      email: u.email || "",
      password: "********",
      username: u.username || "",
      language: u.language || "English",
    });

    // ✅ UPDATE GLOBAL USER
    setUser(u);

    // ✅ UI FEEDBACK
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    setEditField(null); // close modal

  } catch (err) {
    console.log("FULL ERROR:", err.response?.data);
    alert(err.response?.data?.msg || "Failed to save changes");
  }
};
  /* LOADING */
  if (pageLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#0f172a]" : "bg-gray-50"
        }`}
      >
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {error}
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "account", label: "Account & Security", icon: Shield },
  ];

  return (
    <>
      <div
        className={`min-h-screen px-6 py-10 ${
          darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6"
          >
            <div>
             <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 tracking-tight text-[#23b8ab]">
  <SettingsIcon className="text-[#56c9b9]" />
  Settings
</h1>

              <p className="text-base text-gray-400 mt-2">
                Manage your profile and account preferences
              </p>
            </div>

            {saved && (
              <div className="px-6 py-2 rounded-xl bg-teal-500/10 text-teal-500 text-sm font-semibold shadow">
                Changes saved successfully ✓
              </div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-4 gap-10">
            {/* SIDEBAR */}
            <div
              className={`rounded-3xl p-6 backdrop-blur-lg border ${
                darkMode
                  ? "bg-white/5 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                  : "bg-white/80 border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              }`}
            >
              {/* PROFILE CARD */}
              <div className="text-center mb-10">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 blur-xl opacity-40"></div>

                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white/10">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </div>

                <p className="font-semibold text-lg">{user?.name || "User"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {accountData?.email}
                </p>
              </div>

              {/* TABS */}
              <div className="flex flex-col gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium
                      ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-[1.02]"
                          : darkMode
                          ? "text-gray-300 hover:bg-white/5 hover:scale-[1.01]"
                          : "text-gray-700 hover:bg-gray-100 hover:scale-[1.01]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`md:col-span-3 rounded-3xl p-10 backdrop-blur-lg border
              ${
                darkMode
                  ? "bg-white/5 border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.45)]"
                  : "bg-white/80 border-gray-200 shadow-[0_10px_50px_rgba(0,0,0,0.08)]"
              }`}
            >
              {/* BASIC INFO (with rectangle box) */}
              {activeTab === "basic" && (
                <div
                  className={`rounded-2xl border p-8 ${
                    darkMode
                      ? "bg-slate-900/60 border-white/10"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <BasicInfo
                    data={basicData}
                    onEdit={(field) => {
                      setActiveTab("basic");
                      setEditField(field);
                    }}
                  />
                </div>
              )}

              {/* ACCOUNT INFO (no extra box above it) */}
              {activeTab === "account" && (
                <AccountInfo
                  data={accountData}
                  onEdit={(field) => {
                    setActiveTab("account");
                    setEditField(field);
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editField && (
        <EditModal
          field={editField}
          currentValue={
            activeTab === "basic"
              ? basicData[editField]
              : accountData[editField]
          }
          onSave={handleSave}
          onClose={() => setEditField(null)}
        />
      )}
    </>
  );
};

export default Settings;