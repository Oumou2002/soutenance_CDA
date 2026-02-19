function BaseFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer text-white" style={{ marginTop: "96px" }}>
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-5">
                        <h4 className="fw-bold mb-3">Certification CDA</h4>
                        <p className="mb-0 opacity-75">
                            Une plateforme claire, rapide et orientee pratique pour apprendre, suivre sa progression et
                            valider ses competences.
                        </p>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">Navigation</h5>
                        <p className="mb-2">Accueil</p>
                        <p className="mb-2">Catalogue de cours</p>
                        <p className="mb-0">Espaces etudiant et formateur</p>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h5 className="fw-bold mb-3">Contact</h5>
                        <p className="mb-2">123 Rue de la Formation, Paris</p>
                        <p className="mb-2">
                            E-mail:{" "}
                            <a href="mailto:oumoumamoudousow@gmail.com" className="text-white text-decoration-underline">
                                oumoumamoudousow@gmail.com
                            </a>
                        </p>
                        <p className="mb-0">Telephone: (000) 123 456 789</p>
                    </div>
                </div>

                <div className="border-top border-light border-opacity-25 pt-3 mt-4 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <span className="opacity-75">© {currentYear} Certification CDA. Tous droits reserves.</span>
                    <span className="opacity-75">Interface 100% francaise</span>
                </div>
            </div>
        </footer>
    );
}

export default BaseFooter;
