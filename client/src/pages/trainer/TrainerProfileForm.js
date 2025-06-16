import React, { useState } from "react";
import axios from "axios";
import "../../styles/trainerProfileForm.css";




function TrainerProfileForm() {
    const [formData, setFormData] = useState({
        name: "",
        qualifications: "",
        expertise: "",
        specialization: "",
        message: "",
        email: "",
    });
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // append text fields
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        // append file
        if (photo) {
            data.append("photo", photo);
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/upload`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Trainer profile uploaded successfully!");
            console.log(res.data);
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            alert("Upload failed. Check console.");
        }
    };

    return (
        <div className="dashboard-container">

            <div className="trainer-profile-form">

                <h2>Create Trainer Profile</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Name" onChange={handleChange} required />
                    <input name="qualifications" placeholder="Qualifications" onChange={handleChange} required />
                    <input name="expertise" placeholder="Expertise" onChange={handleChange} required />
                    <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
                    <textarea name="message" placeholder="Intro Message" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input name="photo" type="file" accept="image/*" onChange={handleFileChange} required />
                    <button type="submit">Submit Profile</button>
                </form>

            </div>

        </div>
    );
}

export default TrainerProfileForm;
