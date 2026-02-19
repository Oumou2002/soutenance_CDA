import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/auth";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await register(fullName, email, password, password2);
        if (error) {
            alert(error);
            setIsLoading(false);
            return;
        }

        navigate("/");
        alert("Inscription reussie. Vous etes maintenant connecte.");
        setIsLoading(false);
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
                                    <h1 className="mb-1 fw-bold">Inscription</h1>
                                    <span>
                                        Vous avez deja un compte ?
                                        <Link to="/login/" className="ms-1">
                                            Connexion
                                        </Link>
                                    </span>
                                </div>

                                <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="full_name" className="form-label">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            className="form-control"
                                            name="full_name"
                                            placeholder="Jean Dupont"
                                            required=""
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>

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
                                            required=""
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="**************"
                                            required=""
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password_confirmation" className="form-label">
                                            Confirmation du mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="password_confirmation"
                                            className="form-control"
                                            name="password_confirmation"
                                            placeholder="**************"
                                            required=""
                                            onChange={(e) => setPassword2(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled type="submit" className="btn btn-primary">
                                                Creation du compte{" "}
                                                <i className="fas fa-spinner fa-spin" />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                S'inscrire <i className="fas fa-user-plus" />
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

export default Register;
