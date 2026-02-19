import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";

function QADetail() {
    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            <h4 className="mb-0 mb-4">
                                <i className="fas fa-envelope"></i> Questions / Reponses - Cours Angular
                            </h4>

                            <div className="card mb-4">
                                <div className="card-header">
                                    <span>
                                        Cours: <b>Angular Masterclass</b>
                                    </span>
                                    <br />
                                    <span>
                                        Questions: <b>16</b>
                                    </span>
                                </div>
                                <div className="p-2 p-sm-4">
                                    <ul className="list-unstyled mb-0" style={{ overflowY: "scroll", height: "500px" }}>
                                        <li className="comment-item mb-3">
                                            <div className="d-flex">
                                                <div className="avatar avatar-sm flex-shrink-0">
                                                    <img
                                                        className="avatar-img rounded-circle"
                                                        src="https://desphixs.com/geeks/assets/images/avatar/avatar-2.jpg"
                                                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <div className="ms-2">
                                                    <div className="bg-light p-3 rounded w-100">
                                                        <div className="d-flex w-100 justify-content-center">
                                                            <div className="me-2">
                                                                <h6 className="mb-1 lead fw-bold">
                                                                    <span className="text-dark">Jenny Adga</span>
                                                                    <br />
                                                                    <span style={{ fontSize: "12px", color: "gray" }}>Il y a 5h</span>
                                                                </h6>
                                                                <p className="mb-0 mt-3">Comment ajouter une section de cours ?</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    <form className="w-100 row">
                                        <div className="col-lg-10">
                                            <textarea
                                                className="one form-control pe-4 bg-light w-100"
                                                id="autoheighttextarea"
                                                rows="2"
                                                placeholder="Ecrire un message..."
                                            ></textarea>
                                        </div>
                                        <div className="col-lg-2">
                                            <button className="btn btn-primary ms-2 mb-0 w-100" type="button">
                                                Envoyer <i className="fas fa-paper-plane"></i>
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

export default QADetail;
