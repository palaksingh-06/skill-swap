import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const BASIC_FIELDS = [
  { key: "gender", label: "Gender" },
  { key: "location", label: "Location" },
  { key: "birthday", label: "Birthday" },
  { key: "work", label: "Work" },
  // { key: "education", label: "Education" },
];

const BasicInfo = ({ data, onEdit }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      <h2
        className={`text-2xl font-semibold mb-6 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Basic Info
      </h2>

      {BASIC_FIELDS.map(({ key, label }) => (
        <div
          key={key}
          className={`flex justify-between items-center border-b py-4 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <p className="text-gray-500 text-sm">{label}</p>

            <p
              className={`font-medium mt-0.5 ${
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
            className="text-teal-500 hover:text-teal-400 text-sm font-medium ml-4 shrink-0"
          >
            Edit
          </button>
        </div>
      ))}
    </>
  );
};

export default BasicInfo;