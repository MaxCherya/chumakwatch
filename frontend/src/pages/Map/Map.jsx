import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

function Map() {
    const [position, setPosition] = useState(null);
    const [isDayTime, setIsDayTime] = useState(true);
    const [userPosition, setUserPosition] = useState(null);
    const [userHasLocation, setUserHasLocation] = useState(false);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [streetName, setStreetName] = useState('');
    const navigate = useNavigate();

    const getStreetName = async (lat, lng) => {
        const language = 'ua';
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=${language}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.address) {
                setStreetName(data.address.road || 'Невідома вулиця');
            } else {
                console.error('Geocoding API error:', data);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };
    
    const handleAdd = () => {
        if (position) {
          navigate('/adding-marker', {
            state: { position },
          });
        }
      };

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/all_markers/')
            .then((response) => response.json())
            .then((data) => setMarkers(data))
            .catch((error) => console.error("Error fetching markers:", error));
    }, []);    

    const handleCenterMap = () => {
        if (userPosition && map) {
            map.setView(userPosition, 16, { animate: true });
        } else {
            alert("User location not available");
        }
    };

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
                    setUserHasLocation(true)
                },
                (error) => console.error("Error getting location: ", error),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            alert("Geolocation is not supported by your browser");
        }
    }, []);

    // Clickable marker
    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition({ lat, lng });
                getStreetName(lat, lng);
            },
        });

        return position ? (
            <Marker position={position}>
                <Popup>
                    <div className="space-y-3 p-4 bg-white rounded-lg shadow-none w-64">
                        {/* Street Name or Loading Text */}
                        <div className="text-md font-medium text-gray-700">
                            {streetName ? streetName : 'Loading street name...'}
                        </div>
        
                        {/* Action Buttons */}
                        <div className="flex justify-between space-x-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleAdd}>
                                Додати
                            </button>
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            onClick={() => {map.closePopup()}}>
                                Відміна
                            </button>
                        </div>
                    </div>
                </Popup>
            </Marker>
        ) : null;             
    }
    
    function ShowUserLocationButton() {
        return <div className="fixed bottom-7 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-auto">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
                        onClick={handleCenterMap}
                    >
                        Моя локація
                    </button>
                </div>
    }

    return (
        <div className="relative" style={{ height: "100vh", width: "100%" }}>
            <ShowUserLocationButton />
            <MapContainer
                center={userHasLocation ? userPosition : [48.46432837962857, 35.04685470263019]}
                zoom={userHasLocation ? 16 : 12}
                minZoom={9}
                maxZoon={16}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                ref={setMap}
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
                        <Popup>Ви зараз знаходитесь тут</Popup>
                    </Marker>
                )}
                {/* Render each marker */}
                {markers.length > 0 ? markers.map((marker) => (
                    <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
                        <Popup>
                            <strong>Type:</strong> {marker.marker_type} <br />
                            <strong>Severity:</strong> {marker.severity} <br />
                            <strong>Comment:</strong> {marker.commentar}
                        </Popup>
                    </Marker>
                )) : null}
                <LocationMarker />
            </MapContainer>
        </div>
    );
}

export default Map;