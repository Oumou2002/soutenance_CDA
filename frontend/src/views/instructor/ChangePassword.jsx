import { useState } from "react";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";

function ChangePassword() {
    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const handlePasswordChange = (event) => {
        setPassword((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const changePasswordSubmit = async (event) => {
        event.preventDefault();

        if (password.confirm_new_password !== password.new_password) {
            Toast().fire({
                icon: "error",
                title: "Les mots de passe ne correspondent pas.",
            });
            return;
        }

        const formdata = new FormData();
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("old_password", password.old_password);
        formdata.append("new_password", password.new_password);

        try {
            const res = await useAxios.post("user/change-password/", formdata);
            Toast().fire({
                icon: res.data.icon || "success",
                title: res.data.message || "Mot de passe modifie avec succes.",
            });
            setPassword({
                old_password: "",
                new_password: "",
                confirm_new_password: "",
            });
        } catch (error) {
            Toast().fire({
                icon: "error",
                title: "Impossible de modifier le mot de passe.",
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
                                    <i className="fas fa-shield-alt"></i> Changer le mot de passe
                                </h2>
                            </div>

                            <div className="workspace-panel">
                                <div className="workspace-panel-head">
                                    <h3>Protection du compte formateur</h3>
                                    <p className="workspace-subtitle">
                                        Renouvelez votre mot de passe regulierement pour securiser vos contenus.
                                    </p>
                                </div>

                                <div className="workspace-panel-body">
                                    <form className="workspace-grid" onSubmit={changePasswordSubmit}>
                                        <div className="workspace-grid-full">
                                            <label className="form-label" htmlFor="old-password-instructor">
                                                Mot de passe actuel
                                            </label>
                                            <input
                                                id="old-password-instructor"
                                                type="password"
                                                className="form-control"
                                                placeholder="**************"
                                                required
                                                name="old_password"
                                                value={password.old_password}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="new-password-instructor">
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                id="new-password-instructor"
                                                type="password"
                                                className="form-control"
                                                placeholder="**************"
                                                required
                                                name="new_password"
                                                value={password.new_password}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="confirm-password-instructor">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                id="confirm-password-instructor"
                                                type="password"
                                                className="form-control"
                                                placeholder="**************"
                                                required
                                                name="confirm_new_password"
                                                value={password.confirm_new_password}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>

                                        <div className="workspace-grid-full">
                                            <button className="btn btn-primary" type="submit">
                                                Enregistrer le nouveau mot de passe{" "}
                                                <i className="fas fa-check-circle"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default ChangePassword;
