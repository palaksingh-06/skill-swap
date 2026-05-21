import { useState, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const EditModal = ({ field, currentValue, onSave, onClose }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [value, setValue] = useState(
    field === "password" ? "" : currentValue || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    await onSave(field, value.trim());
    setSaving(false);
  };

  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm outline-none
    focus:ring-2 focus:ring-teal-400 transition
    ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-800"
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className={`w-[420px] rounded-xl p-6 shadow-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold capitalize ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Edit {field}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <input
          type={field === "password" ? "password" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter new ${field}`}
          className={inputCls}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !value.trim()}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50
            text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            {saving && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;