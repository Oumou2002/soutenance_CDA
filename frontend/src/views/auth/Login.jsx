import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(email, password);
        if (error) {
            alert(error);
            setIsLoading(false);
            return;
        }

        navigate("/");
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
                                    <h1 className="mb-1 fw-bold">Connexion</h1>
                                    <span>
                                        Vous n'avez pas encore de compte ?
                                        <Link to="/register/" className="ms-1">
                                            Inscription
                                        </Link>
                                    </span>
                                </div>

                                <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
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

                                    <div className="d-lg-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="rememberme"
                                                required=""
                                            />
                                            <label className="form-check-label" htmlFor="rememberme">
                                                Se souvenir de moi
                                            </label>
                                        </div>

                                        <div>
                                            <Link to="/forgot-password/">Mot de passe oublie ?</Link>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled type="submit" className="btn btn-primary">
                                                Connexion en cours{" "}
                                                <i className="fas fa-spinner fa-spin" />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                Se connecter <i className="fas fa-sign-in-alt" />
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

export default Login;
