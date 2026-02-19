import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Toast from "../plugin/Toast";

function CreateNewPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParam] = useSearchParams();
    const otp = searchParam.get("otp");
    const uuidb64 = searchParam.get("uuidb64");
    const refresh_token = searchParam.get("refresh_token");

    const handleCreatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (confirmPassword !== password) {
            Toast().fire({
                icon: "warning",
                title: "Les mots de passe ne correspondent pas.",
            });
            setIsLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("password", password);
        formdata.append("otp", otp);
        formdata.append("uuidb64", uuidb64);
        formdata.append("refresh_token", refresh_token);

        try {
            const res = await apiInstance.post("user/password-change/", formdata);
            navigate("/login/");
            Toast().fire({
                icon: "success",
                title: res.data?.message || "Mot de passe mis a jour avec succes.",
            });
        } catch (error) {
            console.log(error);
            Toast().fire({
                icon: "error",
                title: "Impossible de mettre a jour le mot de passe.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <BaseHeader />

            <section className="container d-flex flex-column auth-shell">
                <div className="row align-items-center justify-content-center g-0 py-5">
                    <div className="col-lg-5 col-md-8 py-3">
                        <div className="card shadow">
                            <div className="card-body p-4 p-lg-5">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">Creer un nouveau mot de passe</h1>
                                    <span>Choisissez un mot de passe solide pour securiser votre compte.</span>
                                </div>

                                <form className="needs-validation" noValidate="" onSubmit={handleCreatePassword}>
                                    <div className="mb-3">
                                        <label htmlFor="new-password" className="form-label">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="new-password"
                                            className="form-control"
                                            name="new-password"
                                            placeholder="**************"
                                            required=""
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirm-password" className="form-label">
                                            Confirmation du mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="confirm-password"
                                            className="form-control"
                                            name="confirm-password"
                                            placeholder="**************"
                                            required=""
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled type="submit" className="btn btn-primary">
                                                Mise a jour en cours{" "}
                                                <i className="fas fa-spinner fa-spin" />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                Enregistrer le nouveau mot de passe{" "}
                                                <i className="fas fa-check-circle" />
                                            </button>
                                        )}
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

export default CreateNewPassword;
