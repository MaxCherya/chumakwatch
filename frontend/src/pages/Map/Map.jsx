import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map() {
    const [position, setPosition] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isDayTime, setIsDayTime] = useState(true);
    const [userPosition, setUserPosition] = useState(null);

    // Determine day or night mode
    useEffect(() => {
        const hour = new Date().getHours();
        setIsDayTime(hour >= 6 && hour < 17);
    }, []);

    // Watch user’s real-time location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("Error getting location: ", error),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            alert("Geolocation is not supported by your browser");
        }
    }, []);

    // Clickable marker to display form
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                setShowForm(true);
            },
        });

        return position ? (
            <Marker position={position}>
                <Popup>You clicked here!</Popup>
            </Marker>
        ) : null;
    }

    // Modal form for adding markers
    function CreationMenu() {
        const [type, setType] = useState('');
        const [severity, setSeverity] = useState(1);

        useEffect(() => {
            if (showForm) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, [showForm]);
    
        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Type:', type);
            console.log('Severity:', severity);
            setShowForm(false);
        };
    
        return showForm ? (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center w-screen h-screen">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 lg:w-1/2">
                    <h2 className="text-xl font-bold mb-4">Додавання маркеру</h2>
                    <p className="text-sm mb-4">Побачили проблему у дорозі? Повідом іншим чумакам!</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Тип:</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="" disabled>Оберіть</option>
                                <option value="Accident">Аварія</option>
                                <option value="Road Condition">Погана дорога</option>
                                <option value="Traffic Jam">Затор</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Складність (1-5):</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={severity}
                                onChange={(e) => setSeverity(Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button 
                                type="button"
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowForm(false)}
                            >
                                Відмінити
                            </button>
                            <button 
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        ) : null;
    }    

    return (
        <div className="relative" style={{ height: "100vh", width: "100%" }}>
            <CreationMenu />
            <MapContainer
                center={userPosition || [48.46432837962857, 35.04685470263019]}
                zoom={12}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                {isDayTime ? (
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                ) : (
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                )}
                {userPosition && (
                    <Marker position={userPosition}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
                <LocationMarker />
            </MapContainer>
        </div>
    );
}

export default Map;