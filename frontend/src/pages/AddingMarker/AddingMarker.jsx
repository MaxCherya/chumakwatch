import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useLocation, useNavigate } from 'react-router-dom';

function AddingMarker() {

    const [type, setType] = useState('');
    const [severity, setSeverity] = useState(1);
    const [commentar, setCommentar] = useState('')
    const [captcha, setCaptcha] = useState(null)
    const location = useLocation();
    const { position } = location.state || {};
    const navigate = useNavigate();


    const handleCaptchaChange = (value) => {
        setCaptcha(value);
      };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captcha) {
            alert("Please complete the CAPTCHA");
            return;
        }
        
        const data = {
            marker_type: type,
            severity: severity,
            commentar: commentar,
            latitude: parseFloat(position.lat.toFixed(6)),
            longitude: parseFloat(position.lng.toFixed(6)),
            captcha: captcha,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/add_marker/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log('Marker added successfully');
            } else {
                console.error('Error adding marker');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        navigate('/');

    };

    return (
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

                    <div>
                        <label className="block text-gray-700">Короткий коментар:</label>
                        <input
                            type="text"
                            value={commentar}
                            onChange={(e) => setCommentar(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <ReCAPTCHA
                            sitekey="6LfhsHwqAAAAAMDL2TJWmmJYlB3RJTjoDtVITFy0"
                            onChange={handleCaptchaChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            Відмінити
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Додати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddingMarker;