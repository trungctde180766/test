import React, { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  // Make sure Bootstrap is imported
import { Carousel } from 'react-bootstrap';  // Import Carousel component from react-bootstrap

// Define action types
const ACTIONS = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    SET_PATIENTS: 'SET_PATIENTS',
};

// Define the reducer function
const patientReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_PATIENTS:
            return {
                ...state,
                patients: action.payload,
            };
        case ACTIONS.ADD:
            return {
                ...state,
                patients: [...state.patients, action.payload],
            };
        case ACTIONS.EDIT:
            return {
                ...state,
                patients: state.patients.map((patient) =>
                    patient.id === action.payload.id ? action.payload : patient
                ),
            };
        case ACTIONS.DELETE:
            return {
                ...state,
                patients: state.patients.filter((patient) => patient.id !== action.payload),
            };
        default:
            return state;
    }
};

const PatientManagement = () => {
    const [state, dispatch] = useReducer(patientReducer, { patients: [] });
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]); // State to store image data for carousel

    useEffect(() => {
        fetchPatients();
        fetchImages(); // Fetch images for the carousel
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/patients');
            dispatch({ type: ACTIONS.SET_PATIENTS, payload: response.data });
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchImages = () => {
        const imagesArray = [
            { id: 1, src: '/images/6c1.jpg', alt: 'Patient 1' },
            { id: 2, src: '/images/c1.jpg', alt: 'Patient 2' },
            { id: 3, src: '/images/real.jpg', alt: 'Patient 3' },
        ];
        setImages(imagesArray); // Set images to state
    };

    const addPatient = async () => {
        if (name && age && gender && address) {
            const newPatient = {
                name,
                age,
                gender,
                address,
            };
            try {
                const response = await axios.post('http://localhost:5000/patients', newPatient);
                dispatch({ type: ACTIONS.ADD, payload: response.data });
                clearForm();
            } catch (error) {
                console.error('Error adding patient:', error);
            }
        }
    };

    const editPatient = async () => {
        if (name && age && gender && address) {
            const updatedPatient = {
                name,
                age,
                gender,
                address,
            };
            try {
                const response = await axios.put(`http://localhost:5000/patients/${currentPatientId}`, updatedPatient);
                dispatch({ type: ACTIONS.EDIT, payload: response.data });
                setEditMode(false);
                clearForm();
            } catch (error) {
                console.error('Error editing patient:', error);
            }
        }
    };

    const deletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await axios.delete(`http://localhost:5000/patients/${id}`);
                dispatch({ type: ACTIONS.DELETE, payload: id });
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handleEdit = (patient) => {
        setName(patient.name);
        setAge(patient.age);
        setGender(patient.gender);
        setAddress(patient.address);
        setEditMode(true);
        setCurrentPatientId(patient.id);
    };

    const clearForm = () => {
        setName('');
        setAge('');
        setGender('');
        setAddress('');
    };

    // Filter patients based on the search term
    const filteredPatients = state.patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Patient Management</h2>

            {/* Search Bar */}
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Search Patient by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Image Carousel */}
            <Carousel>
                {images.map((image, index) => (
                    <Carousel.Item key={image.id}>
                        <img
                            className="d-block w-100"
                            src={image.src}
                            alt={image.alt}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Patient Form */}
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {editMode ? (
                    <button onClick={editPatient}>Save Changes</button>
                ) : (
                    <button onClick={addPatient}>Add Patient</button>
                )}
            </div>

            {/* Patient List */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.address}</td>
                            <td>
                                <button onClick={() => handleEdit(patient)}>Edit</button>
                                <button onClick={() => deletePatient(patient.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientManagement;
