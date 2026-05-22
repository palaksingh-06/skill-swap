



import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

const EditModal = ({ field, currentValue, onSave, onClose }) => {
  const [value, setValue] = useState(currentValue || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [position, setPosition] = useState([28.6139, 77.2090]); // default Delhi

  const fieldName = field?.toLowerCase();

  const handleSubmit = () => {
    // If user is editing password
    if (fieldName === "password") {
      if (!oldPassword || !newPassword) {
        alert("Please enter both current and new password");
        return;
      }

      onSave(field, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      return;
    }

    // Normal fields
    onSave(field, value);
  };

  // Auto-detect user current location when opening location modal
  useEffect(() => {
    if (fieldName === "location" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
      });
    }
  }, [fieldName]);

  // Marker + click logic
  const LocationSelector = ({ position, setPosition, setValue }) => {
    const map = useMap();

    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setPosition([lat, lng]);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              data.display_name;

            setValue(city);
          });
      },
    });

    useEffect(() => {
      map.setView(position, 10);
    }, [position]);

    return <Marker position={position} />;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-lg font-semibold mb-4 capitalize">
          Edit {field}
        </h2>

        {fieldName === "location" ? (

          <div className="mb-4">

            {/* Search box */}
            <input
              type="text"
              placeholder="Search city (Jaipur, Delhi, Ajmer...)"
              className="w-full p-2 border rounded mb-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}&accept-language=en`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.length > 0) {
                        const lat = data[0].lat;
                        const lng = data[0].lon;

                        setPosition([lat, lng]);
                        setValue(data[0].display_name);
                      }
                    });
                }
              }}
            />

            {/* Current location button */}
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const lat = pos.coords.latitude;
                  const lng = pos.coords.longitude;

                  setPosition([lat, lng]);

                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`)
                    .then((res) => res.json())
                    .then((data) => {
                      const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.state ||
                        data.display_name;

                      setValue(city);
                    });
                });
              }}
              className="w-full mb-2 bg-teal-500 text-white py-2 rounded"
            >
              📍 Use My Current Location
            </button>

            {/* Map */}
            <div className="h-[300px] w-full rounded-lg overflow-hidden">
              <MapContainer
                center={position}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationSelector
                  position={position}
                  setPosition={setPosition}
                  setValue={setValue}
                />
              </MapContainer>
            </div>

            {value && (
              <p className="text-sm text-teal-600 mt-2 font-medium">
                Selected: {value}
              </p>
            )}

          </div>

        ) : fieldName === "gender" ? (

          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

        ) : fieldName === "birthday" ? (

          <input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

        ) : fieldName === "password" ? (

          <>
            <input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
          </>

        ) : (

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-500 text-white rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditModal;