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
                                <Link className="nav-link" to="/student/dashboard/">
                                    <i className="bi bi-grid-fill" />
                                    Tableau de bord
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/student/courses/">
                                    <i className="fas fa-book" />
                                    Mes cours
                                </Link>
                            </li>
                        </ul>

                        <span className="navbar-header mb-3">Parametres du compte</span>
                        <ul className="list-unstyled ms-n2 mb-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/student/profile/">
                                    <i className="fas fa-edit" />
                                    Modifier le profil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/student/change-password/">
                                    <i className="fas fa-lock" />
                                    Changer le mot de passe
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/logout/">
                                    <i className="fas fa-sign-out-alt" />
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
