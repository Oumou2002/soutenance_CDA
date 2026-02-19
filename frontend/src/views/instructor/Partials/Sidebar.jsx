import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="col-lg-3 col-md-4 col-12">
            <nav className="navbar navbar-expand-md shadow-sm mb-4 mb-lg-0 sidenav">
                <a
                    className="d-xl-none d-lg-none d-md-none text-inherit fw-bold text-decoration-none text-dark p-3"
                    href="#"
                >
                    Menu
                </a>

                <button
                    className="navbar-toggler d-md-none icon-shape icon-sm rounded bg-primary text-light m-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidenav"
                    aria-controls="sidenav"
                    aria-expanded="false"
                    aria-label="Basculer la navigation"
                >
                    <span className="bi bi-grid" />
                </button>

                <div className="collapse navbar-collapse p-3" id="sidenav">
                    <div className="navbar-nav flex-column">
                        <ul className="list-unstyled ms-n2 mb-4">
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/dashboard/">
                                    <i className="bi bi-grid-fill me-2" />
                                    Tableau de bord
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/courses/">
                                    <i className="fas fa-book me-2" />
                                    Mes cours
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/create-course/">
                                    <i className="fas fa-plus me-2" />
                                    Creer un cours
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/reviews/">
                                    <i className="fas fa-star me-2" />
                                    Avis
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/students/">
                                    <i className="fas fa-graduation-cap me-2" />
                                    Etudiants
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/notifications/">
                                    <i className="fas fa-bell me-2" />
                                    Notifications
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/question-answer/">
                                    <i className="fas fa-envelope me-2" />
                                    Questions / Reponses
                                </Link>
                            </li>
                        </ul>

                        <span className="navbar-header mb-3">Parametres du compte</span>
                        <ul className="list-unstyled ms-n2 mb-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/profile/">
                                    <i className="fas fa-edit me-2" />
                                    Modifier le profil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/change-password/">
                                    <i className="fas fa-lock me-2" />
                                    Changer le mot de passe
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/logout/">
                                    <i className="fas fa-sign-out-alt me-2" />
                                    Se deconnecter
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
