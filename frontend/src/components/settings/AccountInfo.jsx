import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const ACCOUNT_FIELDS = [
  { key: "email", label: "Email" },
  { key: "password", label: "Password" },
  // { key: "username", label: "Username" },
  { key: "language", label: "Language" },
];

const AccountInfo = ({ data, onEdit }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      <h2
        className={`text-2xl font-semibold mb-6 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Account Information
      </h2>

      <div
        className={`rounded-xl p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        } shadow-sm`}
      >
        <h3
          className={`font-semibold text-base mb-1 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Account Details
        </h3>

        <p
          className={`text-sm mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage your login info and preferences.
        </p>

        {ACCOUNT_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className={`flex justify-between items-center border-b py-4 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                {label}
              </p>

              <p
                className={`font-medium ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {data?.[key] || (
                  <span className="text-gray-400 italic text-sm">
                    Not set
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => onEdit(key)}
              className="text-teal-500 hover:text-teal-400 font-semibold text-sm ml-4 shrink-0"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccountInfo;