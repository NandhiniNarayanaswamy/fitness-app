import React, { useEffect, useState } from "react";
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
    const [existingProfileId, setExistingProfileId] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = localStorage.getItem("email");
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/${email}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data) {
                    setFormData({
                        name: res.data.name || "",
                        qualifications: res.data.qualifications || "",
                        expertise: res.data.expertise || "",
                        specialization: res.data.specialization || "",
                        message: res.data.message || "",
                        email: res.data.email || "",
                    });
                    setExistingProfileId(res.data._id);
                }
            } catch (err) {
                console.log("No existing profile found or error fetching:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        for (const key in formData) {
            data.append(key, formData[key]);
        }

        if (photo) {
            data.append("photo", photo);
        }

        try {
            if (existingProfileId) {
                const res = await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/update/${existingProfileId}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                alert("Profile updated successfully!");
                console.log(res.data);
            } else {
                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/upload`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                alert("Profile created successfully!");
                setExistingProfileId(res.data._id);
                console.log(res.data);
            }
        } catch (err) {
            console.error("Profile submission failed:", err.response?.data || err.message);
            alert("Submission failed. See console for details.");
        }
    };

    if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

    return (
        <div className="dashboard-container">
            <div className="trainer-profile-form">
                <h2>{existingProfileId ? "Update Trainer Profile" : "Create Trainer Profile"}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} required />
                    <input name="expertise" placeholder="Expertise" value={formData.expertise} onChange={handleChange} required />
                    <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required />
                    <textarea name="message" placeholder="Intro Message" value={formData.message} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input name="photo" type="file" accept="image/*" onChange={handleFileChange} />
                    <button type="submit">{existingProfileId ? "Update Profile" : "Submit Profile"}</button>
                </form>
            </div>
        </div>
    );
}

export default TrainerProfileForm;
