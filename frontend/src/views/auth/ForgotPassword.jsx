import { useState } from "react";
import apiInstance from "../../utils/axios";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiInstance.get(`user/password-reset/${email}/`);
            alert("E-mail de reinitialisation envoye.");
        } catch (error) {
            console.log("error: ", error);
            alert("Impossible d'envoyer l'e-mail de reinitialisation.");
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
                                    <h1 className="mb-1 fw-bold">Mot de passe oublie</h1>
                                    <span>Saisissez votre e-mail pour recevoir un lien de reinitialisation.</span>
                                </div>

                                <form className="needs-validation" noValidate="" onSubmit={handleEmailSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Adresse e-mail
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="exemple@mail.com"
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled type="submit" className="btn btn-primary">
                                                Envoi en cours <i className="fas fa-spinner fa-spin" />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                Reinitialiser le mot de passe{" "}
                                                <i className="fas fa-arrow-right" />
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

export default ForgotPassword;
