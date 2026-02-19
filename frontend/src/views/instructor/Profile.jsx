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
                title: "Profil formateur mis a jour.",
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
                                    <i className="fas fa-chalkboard-teacher"></i> Profil formateur
                                </h2>
                            </div>

                            <div className="workspace-panel">
                                <div className="workspace-panel-head">
                                    <h3>Identite professionnelle</h3>
                                    <p className="workspace-subtitle">
                                        Optimise ton profil pour inspirer confiance et attirer plus d'etudiants.
                                    </p>
                                </div>

                                <form className="workspace-panel-body" onSubmit={handleFormSubmit}>
                                    <div className="workspace-avatar-block">
                                        <img
                                            src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                            className="workspace-avatar"
                                            alt="avatar formateur"
                                        />
                                        <div className="w-100">
                                            <h4 className="workspace-section-title">Photo de profil</h4>
                                            <p className="workspace-section-text">
                                                Utilise une photo claire pour renforcer la credibilite.
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
                                            <label className="form-label" htmlFor="teacher-full-name">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                id="teacher-full-name"
                                                className="form-control"
                                                placeholder="Nom complet"
                                                value={profileData.full_name || ""}
                                                onChange={handleProfileChange}
                                                name="full_name"
                                            />
                                        </div>

                                        <div className="workspace-grid-full">
                                            <label className="form-label" htmlFor="teacher-about">
                                                Biographie
                                            </label>
                                            <textarea
                                                onChange={handleProfileChange}
                                                name="about"
                                                id="teacher-about"
                                                rows="5"
                                                className="form-control"
                                                placeholder="Presente ton expertise, ton experience et ton style d'enseignement."
                                                value={profileData.about || ""}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="teacher-country">
                                                Pays
                                            </label>
                                            <input
                                                type="text"
                                                id="teacher-country"
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
