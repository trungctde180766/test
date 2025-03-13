import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PatientManagement from './components/PatientManagement';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/patients" element={<PatientManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
