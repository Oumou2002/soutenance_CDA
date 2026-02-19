import { useEffect } from "react";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import { logout } from "../../utils/auth";
import { Link } from "react-router-dom";

function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <BaseHeader />

      <section className="container d-flex flex-column auth-shell">
        <div className="row align-items-center justify-content-center g-0 py-5">
          <div className="col-lg-5 col-md-8 py-3">
            <div className="card shadow">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Vous etes deconnecte.</h1>
                  <span>Merci pour votre visite. Revenez quand vous voulez.</span>
                </div>
                <form className="needs-validation mt-5" noValidate="">
                  <div className="d-grid d-flex">
                    <Link to={`/login/`} className="btn btn-primary me-2 w-100">
                      Connexion <i className="fas fa-sign-in-alt"></i>
                    </Link>
                    <Link to={`/register/`} className="btn btn-primary w-100">
                      Inscription <i className="fas fa-user-plus"></i>
                    </Link>
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

export default Logout;
