import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './pages/Map/Map';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Map />} />
            </Routes>
        </Router>
    );
}

export default App;
