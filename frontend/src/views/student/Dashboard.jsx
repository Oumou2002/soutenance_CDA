import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchData = () => {
        setFetching(true);

        useAxios.get(`student/summary/${UserData()?.user_id}/`).then((res) => {
            setStats(res.data[0]);
        });

        useAxios.get(`student/course-list/${UserData()?.user_id}/`).then((res) => {
            setCourses(res.data);
            setFetching(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        if (query === "") {
            fetchData();
            return;
        }

        const filtered = courses.filter((course) =>
            course.course.title.toLowerCase().includes(query),
        );
        setCourses(filtered);
    };

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            <div className="row mb-4">
                                <h4 className="mb-0 mb-4">
                                    <i className="bi bi-grid-fill"></i> Tableau de bord
                                </h4>

                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-orange mb-0">
                                            <i className="fas fa-tv fa-fw" />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold">{stats.total_courses}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Total des cours</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-danger bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-purple mb-0">
                                            <i className="fas fa-clipboard-check fa-fw" />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold">{stats.completed_lessons}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Lecons terminees</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                    <div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
                                        <span className="display-6 lh-1 text-success mb-0">
                                            <i className="fas fa-medal fa-fw" />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold">{stats.achieved_certificates}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Certificats obtenus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {fetching && <p className="mt-3 p-3">Chargement...</p>}

                            {!fetching && (
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h3 className="mb-0">Cours</h3>
                                        <span>Lancez vos lecons directement depuis cette page.</span>
                                    </div>
                                    <div className="card-body">
                                        <form className="row gx-3">
                                            <div className="col-lg-12 col-md-12 col-12 mb-lg-0 mb-2">
                                                <input
                                                    type="search"
                                                    className="form-control"
                                                    placeholder="Rechercher dans mes cours"
                                                    onChange={handleSearch}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="table-responsive overflow-y-hidden">
                                        <table className="table mb-0 text-nowrap table-hover table-centered text-nowrap">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Cours</th>
                                                    <th>Date d'inscription</th>
                                                    <th>Lecons</th>
                                                    <th>Terminees</th>
                                                    <th>Action</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courses?.map((course) => (
                                                    <tr key={course.enrollment_id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <img
                                                                        src={course.course.image}
                                                                        alt="cours"
                                                                        className="rounded img-4by3-lg"
                                                                        style={{
                                                                            width: "100px",
                                                                            height: "70px",
                                                                            borderRadius: "50%",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1 h5">
                                                                        <span className="text-dark">{course.course.title}</span>
                                                                    </h4>
                                                                    <ul className="list-inline fs-6 mb-0">
                                                                        <li className="list-inline-item">
                                                                            <i className="fas fa-user"></i>
                                                                            <span className="ms-1">{course.course.language}</span>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <i className="bi bi-reception-4"></i>
                                                                            <span className="ms-1">{course.course.level}</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className="mt-3">{moment(course.date).format("D MMM YYYY")}</p>
                                                        </td>
                                                        <td>
                                                            <p className="mt-3">{course.lectures?.length}</p>
                                                        </td>
                                                        <td>
                                                            <p className="mt-3">{course.completed_lesson?.length}</p>
                                                        </td>
                                                        <td>
                                                            {course.completed_lesson?.length < 1 && (
                                                                <Link
                                                                    to={`/student/courses/${course.enrollment_id}/`}
                                                                    className="btn btn-success btn-sm mt-3"
                                                                >
                                                                    Commencer le cours
                                                                    <i className="fas fa-arrow-right ms-2"></i>
                                                                </Link>
                                                            )}

                                                            {course.completed_lesson?.length > 0 && (
                                                                <Link
                                                                    to={`/student/courses/${course.enrollment_id}/`}
                                                                    className="btn btn-primary btn-sm mt-3"
                                                                >
                                                                    Continuer le cours
                                                                    <i className="fas fa-arrow-right ms-2"></i>
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

                                                {courses?.length < 1 && (
                                                    <tr>
                                                        <td colSpan={6} className="p-4">
                                                            Aucun cours trouve.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Dashboard;
