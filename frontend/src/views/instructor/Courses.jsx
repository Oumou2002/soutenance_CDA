import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

const statusLabelMap = {
    Published: "Publie",
    Draft: "Brouillon",
    Pending: "En attente",
};

function Courses() {
    const [courses, setCourses] = useState([]);

    const fetchCourseData = () => {
        useAxios.get(`teacher/course-lists/${UserData()?.teacher_id}/`).then((res) => {
            setCourses(res.data);
        });
    };

    useEffect(() => {
        fetchCourseData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        if (query === "") {
            fetchCourseData();
            return;
        }

        const filtered = courses.filter((course) => course.title.toLowerCase().includes(query));
        setCourses(filtered);
    };

    const getStatusLabel = (course) => {
        const status = course.teacher_course_status || course.platform_status || "Draft";
        return statusLabelMap[status] || status;
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
                                        <i className="bi bi-collection-fill"></i> Mes cours
                                    </h2>
                                    <p className="workspace-subtitle">
                                        Gerez votre catalogue, suivez les inscriptions et mettez a jour vos contenus.
                                    </p>
                                </div>
                                <Link to="/instructor/create-course/" className="btn btn-primary">
                                    Nouveau cours <i className="fas fa-plus"></i>
                                </Link>
                            </div>

                            <div className="workspace-panel">
                                <div className="workspace-panel-head">
                                    <h3>Catalogue formateur</h3>
                                    <p className="workspace-subtitle">
                                        Filtrez vos cours et accedez rapidement aux actions d'edition.
                                    </p>
                                </div>

                                <div className="workspace-panel-body">
                                    <div className="mb-3">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Rechercher dans mes cours"
                                            onChange={handleSearch}
                                        />
                                    </div>

                                    <div className="table-responsive overflow-y-hidden">
                                        <table className="table workspace-table mb-0 text-nowrap table-hover table-centered">
                                            <thead>
                                                <tr>
                                                    <th>Cours</th>
                                                    <th>Inscrits</th>
                                                    <th>Niveau</th>
                                                    <th>Statut</th>
                                                    <th>Date de creation</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courses?.map((course) => (
                                                    <tr key={course.course_id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={course.image}
                                                                    alt="image du cours"
                                                                    className="rounded img-4by3-lg"
                                                                    style={{
                                                                        width: "100px",
                                                                        height: "70px",
                                                                        borderRadius: "14px",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1 h6">{course.title}</h4>
                                                                    <ul className="list-inline fs-6 mb-0">
                                                                        <li className="list-inline-item">
                                                                            <small>
                                                                                <i className="fas fa-globe"></i>
                                                                                <span className="ms-1">{course.language}</span>
                                                                            </small>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <small>
                                                                                <i className="fas fa-dollar-sign"></i>
                                                                                <span className="ms-1">{course.price}</span>
                                                                            </small>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{course.students?.length || 0}</td>
                                                        <td>
                                                            <span className="workspace-chip">{course.level}</span>
                                                        </td>
                                                        <td>
                                                            <span className="workspace-chip">{getStatusLabel(course)}</span>
                                                        </td>
                                                        <td>{moment(course.date).format("DD MMM YYYY")}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Link
                                                                    to={`/instructor/edit-course/${course.course_id}/`}
                                                                    className="btn btn-primary btn-sm"
                                                                    title="Modifier"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>
                                                                <Link
                                                                    to={`/course-detail/${course.slug}/`}
                                                                    className="btn btn-secondary btn-sm"
                                                                    title="Apercu"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {courses?.length < 1 && (
                                                    <tr>
                                                        <td colSpan={6}>
                                                            <div className="workspace-empty">
                                                                Aucun cours trouve pour cette recherche.
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
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

export default Courses;
