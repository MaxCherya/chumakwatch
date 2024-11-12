import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './pages/Map/Map';
import AddingMarker from './pages/AddingMarker/AddingMarker';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Map />} />
                <Route path="/adding-marker" element={<AddingMarker />} />
            </Routes>
        </Router>
    );
}

export default App;
