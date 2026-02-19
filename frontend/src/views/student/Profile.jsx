import { useContext, useEffect, useState } from "react";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";
import { ProfileContext } from "../plugin/Context";

function Profile() {
    const [, setProfile] = useContext(ProfileContext);
    const [profileData, setProfileData] = useState({
        image: "",
        full_name: "",
        about: "",
        country: "",
    });
    const [imagePreview, setImagePreview] = useState("");

    const fetchProfile = () => {
        useAxios.get(`user/profile/${UserData()?.user_id}/`).then((res) => {
            setProfile(res.data);
            setProfileData(res.data);
            setImagePreview(res.data.image);
        });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileChange = (event) => {
        setProfileData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        setProfileData((prev) => ({
            ...prev,
            image: selectedFile,
        }));

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(selectedFile);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const currentProfile = await useAxios.get(`user/profile/${UserData()?.user_id}/`);
            const formdata = new FormData();

            if (profileData.image && profileData.image !== currentProfile.data.image) {
                formdata.append("image", profileData.image);
            }

            formdata.append("full_name", profileData.full_name || "");
            formdata.append("about", profileData.about || "");
            formdata.append("country", profileData.country || "");

            const updated = await useAxios.patch(`user/profile/${UserData()?.user_id}/`, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfile(updated.data);
            setProfileData(updated.data);
            setImagePreview(updated.data.image);
            Toast().fire({
                icon: "success",
                title: "Profil mis a jour.",
            });
        } catch (error) {
            Toast().fire({
                icon: "error",
                title: "Impossible de mettre a jour le profil.",
            });
        }
    };

    return (
        <>
            <BaseHeader />

            <section className="workspace-shell">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />

                        <div className="col-lg-9 col-md-8 col-12">
                            <div className="workspace-title-row">
                                <h2 className="workspace-title">
                                    <i className="fas fa-user-circle"></i> Mon profil
                                </h2>
                            </div>

                            <div className="workspace-panel">
                                <div className="workspace-panel-head">
                                    <h3>Informations personnelles</h3>
                                    <p className="workspace-subtitle">
                                        Gere ton identite, ta bio et ton pays depuis cet espace.
                                    </p>
                                </div>

                                <form className="workspace-panel-body" onSubmit={handleFormSubmit}>
                                    <div className="workspace-avatar-block">
                                        <img
                                            src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                            className="workspace-avatar"
                                            alt="avatar utilisateur"
                                        />
                                        <div className="w-100">
                                            <h4 className="workspace-section-title">Photo de profil</h4>
                                            <p className="workspace-section-text">
                                                Format conseille: JPG ou PNG, ratio carre.
                                            </p>
                                            <input
                                                type="file"
                                                className="form-control mt-2"
                                                name="image"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="workspace-grid">
                                        <div className="workspace-grid-full">
                                            <label className="form-label" htmlFor="student-full-name">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                id="student-full-name"
                                                className="form-control"
                                                placeholder="Nom complet"
                                                value={profileData.full_name || ""}
                                                onChange={handleProfileChange}
                                                name="full_name"
                                            />
                                        </div>

                                        <div className="workspace-grid-full">
                                            <label className="form-label" htmlFor="student-about">
                                                A propos
                                            </label>
                                            <textarea
                                                onChange={handleProfileChange}
                                                name="about"
                                                id="student-about"
                                                rows="5"
                                                className="form-control"
                                                placeholder="Decris ton parcours, tes objectifs et ton domaine."
                                                value={profileData.about || ""}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="student-country">
                                                Pays
                                            </label>
                                            <input
                                                type="text"
                                                id="student-country"
                                                className="form-control"
                                                placeholder="Pays"
                                                value={profileData.country || ""}
                                                onChange={handleProfileChange}
                                                name="country"
                                            />
                                        </div>

                                        <div className="d-flex align-items-end">
                                            <button className="btn btn-primary w-100" type="submit">
                                                Mettre a jour le profil <i className="fas fa-check-circle"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Profile;
