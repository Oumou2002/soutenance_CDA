import { useEffect, useState } from "react";
import moment from "moment";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function Students() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        useAxios.get(`teacher/student-lists/${UserData()?.teacher_id}/`).then((res) => {
            setStudents(res.data);
        });
    }, []);

    const resolveImageUrl = (image) => {
        if (!image) return "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png";
        return image.startsWith("http") ? image : `http://127.0.0.1:8000${image}`;
    };

    return (
        <>
            <BaseHeader />

            <section className="workspace-shell">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />

                        <div className="col-lg-9 col-md-8 col-12">
                            <div className="workspace-title-row">
                                <div>
                                    <h2 className="workspace-title">
                                        <i className="fas fa-user-graduate"></i> Etudiants
                                    </h2>
                                    <p className="workspace-subtitle">
                                        Retrouvez les apprenants inscrits a vos cours.
                                    </p>
                                </div>
                            </div>

                            {students?.length < 1 && (
                                <div className="workspace-empty">Aucun etudiant inscrit pour le moment.</div>
                            )}

                            <div className="row">
                                {students?.map((student, index) => (
                                    <div className="col-lg-4 col-md-6 col-12" key={`${student.full_name}-${index}`}>
                                        <div className="workspace-panel mb-3">
                                            <div className="workspace-panel-body text-center">
                                                <img
                                                    src={resolveImageUrl(student.image)}
                                                    className="workspace-avatar mb-3"
                                                    alt="avatar etudiant"
                                                />
                                                <h4 className="mb-1">{student.full_name}</h4>
                                                <p className="mb-0">
                                                    <i className="fas fa-map-pin me-1" /> {student.country || "Pays non renseigne"}
                                                </p>
                                                <div className="d-flex justify-content-between py-2 mt-3 fs-6">
                                                    <span className="text-secondary">Inscription</span>
                                                    <span className="text-dark">
                                                        {moment(student.date).format("DD MMM YYYY")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Students;
