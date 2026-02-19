import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function BaseHeader() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const handleSearchSubmit = () => {
        const query = searchQuery.trim();
        navigate(`/search/?search=${encodeURIComponent(query)}`);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg app-navbar">
            <div className="container py-2">
                <Link className="navbar-brand fw-bold" to="/">
                    Certification CDA
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarPrincipal"
                    aria-controls="navbarPrincipal"
                    aria-expanded="false"
                    aria-label="Basculer la navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarPrincipal">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fas fa-chalkboard-user me-2" />
                                Espace formateur
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/instructor/dashboard/">
                                        <i className="bi bi-grid-fill me-2" />
                                        Tableau de bord
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/instructor/courses/">
                                        <i className="fas fa-book me-2" />
                                        Mes cours
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/instructor/create-course/">
                                        <i className="fas fa-plus me-2" />
                                        Creer un cours
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/instructor/reviews/">
                                        <i className="fas fa-star me-2" />
                                        Avis recus
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/instructor/students/">
                                        <i className="fas fa-users me-2" />
                                        Etudiants
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/instructor/profile/">
                                        <i className="fas fa-gear me-2" />
                                        Profil et parametres
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fas fa-graduation-cap me-2" />
                                Espace etudiant
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/student/dashboard/">
                                        <i className="bi bi-grid-fill me-2" />
                                        Tableau de bord
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/student/courses/">
                                        <i className="fas fa-book me-2" />
                                        Mes cours
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/student/profile/">
                                        <i className="fas fa-user me-2" />
                                        Profil et parametres
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <div className="d-flex" role="search">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Rechercher un cours"
                                aria-label="Rechercher un cours"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>

                        {isLoggedIn() === true ? (
                            <Link to="/logout/" className="btn btn-primary" type="button">
                                Deconnexion <i className="fas fa-sign-out-alt ms-1" />
                            </Link>
                        ) : (
                            <Link to="/login/" className="btn btn-primary" type="button">
                                Connexion <i className="fas fa-sign-in-alt ms-1" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BaseHeader;
