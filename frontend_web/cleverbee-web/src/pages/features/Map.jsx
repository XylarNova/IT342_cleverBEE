// Maps.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "./Sidebar";
import { FaMapMarkerAlt } from "react-icons/fa";
import api from "../../api/api"; // Import the api.js file

const libraryIcon = new L.Icon({
  iconUrl: "/icons/library.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
const cafeIcon = new L.Icon({
  iconUrl: "/icons/cafe.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
const loungeIcon = new L.Icon({
  iconUrl: "/icons/lounge.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const isOpenNow = (hours) => {
  const [start, end] = hours.split(" - ");
  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;
  const parseTime = (str) =>
    str.split(":").map(Number).reduce((h, m) => h + m / 60);
  return currentTime >= parseTime(start) && currentTime <= parseTime(end);
};

const calculateDistanceTime = (lat1, lng1, lat2, lng2) => {
  const R = 6371,
    toRad = (x) => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1),
    dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return {
    walkTime: Math.round((distance / 5) * 60),
    driveTime: Math.round((distance / 40) * 60),
  };
};

const getIconByType = (type) => {
  switch (type) {
    case "Cafe":
      return cafeIcon;
    case "Public Library":
      return libraryIcon;
    case "Study Lounge":
      return loungeIcon;
    default:
      return userIcon;
  }
};

const Maps = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [filter, setFilter] = useState("All");
  const [studyLocations, setStudyLocations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setUserLocation([position.coords.latitude, position.coords.longitude]),
      () => setUserLocation([14.584, 121.175])
    );
  }, []);

  useEffect(() => {
    const fetchStudyPlaces = async () => {
      try {
        if (!userLocation) return;
        const radius = 10; // km
        const response = await api.get("/study-places", {
          params: {
            lat: userLocation[0],
            lng: userLocation[1],
            radius: radius,
          },
        });
        if (response.data.status === "success") {
          setStudyLocations(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch study places:", error);
      }
    };
    fetchStudyPlaces();
  }, [userLocation]);

  const filteredLocations =
    filter === "All" ? studyLocations : studyLocations.filter((loc) => loc.type === filter);

  return (
    <div className="flex min-h-screen relative z-0">
      <Sidebar />

      <div className="flex-1 flex p-6 bg-gray-100 overflow-hidden">
        <div className="w-3/5 pr-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-yellow-600">Study Map</h1>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm shadow"
            >
              <option value="All">All Types</option>
              <option value="Public Library">Library</option>
              <option value="Study Lounge">Study Lounge</option>
              <option value="Cafe">Cafe</option>
            </select>
          </div>

          {userLocation ? (
            <MapContainer
              center={userLocation}
              zoom={15}
              className="h-[75vh] w-full rounded-lg shadow-lg z-10"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={userLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {filteredLocations.map((place, index) => {
                const { walkTime, driveTime } = calculateDistanceTime(
                  userLocation[0],
                  userLocation[1],
                  place.lat,
                  place.lng
                );
                return (
                  <Marker
                    key={index}
                    position={[place.lat, place.lng]}
                    icon={getIconByType(place.type)}
                  >
                    <Popup>
                      <strong>{place.name}</strong>
                      <br />
                      Type: {place.type}
                      <br />
                      Open: {place.openHours}
                      <br />
                      Status:{" "}
                      <span
                        className={
                          isOpenNow(place.openHours)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {isOpenNow(place.openHours) ? "Open" : "Closed"}
                      </span>
                      <br />
                      Seats: {place.seatsAvailable}
                      <br />
                      🚶 {walkTime} min | 🚗 {driveTime} min
                      <br />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Navigate
                      </a>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <p className="text-gray-500 text-center">Loading map...</p>
          )}
        </div>

        <div className="w-2/5 bg-white rounded-lg shadow-lg p-4 overflow-y-auto h-[75vh]">
          <h2 className="text-xl font-semibold mb-3">
            Nearby {filter === "All" ? "Places" : filter}s
          </h2>
          {filteredLocations.length === 0 ? (
            <p className="text-sm text-gray-500">No nearby results found.</p>
          ) : (
            filteredLocations.map((place, index) => {
              const { walkTime, driveTime } = calculateDistanceTime(
                userLocation[0],
                userLocation[1],
                place.lat,
                place.lng
              );
              return (
                <div key={index} className="border-b py-2">
                  <h3 className="text-lg font-bold text-yellow-600">{place.name}</h3>
                  <p className="text-sm text-gray-600">Type: {place.type}</p>
                  <p className="text-sm">
                    🕒 {place.openHours} —{" "}
                    <span
                      className={
                        isOpenNow(place.openHours)
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {isOpenNow(place.openHours) ? "Open" : "Closed"}
                    </span>
                  </p>
                  <p className="text-sm">🚶 {walkTime} min | 🚗 {driveTime} min</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    Get Directions
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Maps;
