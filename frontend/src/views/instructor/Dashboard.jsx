import { useEffect, useState } from "react";
import moment from "moment";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function Dashboard() {
    const [stats, setStats] = useState([]);
    const [courses, setCourses] = useState([]);

    const fetchCourseData = () => {
        useAxios.get(`teacher/summary/${UserData()?.teacher_id}/`).then((res) => {
            setStats(res.data[0]);
        });

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
                                            <i className="fas fa-tv fa-fw text-warning" />
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
                                            <i className="fas fa-graduation-cap text-danger fa-fw" />
                                        </span>
                                        <div className="ms-4">
                                            <div className="d-flex">
                                                <h5 className="purecounter mb-0 fw-bold">{stats.total_students}</h5>
                                            </div>
                                            <p className="mb-0 h6 fw-light">Total des etudiants</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="mb-0">Cours</h3>
                                    <span>Gerez vos cours: recherche, suivi, edition et suppression.</span>
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
                                                <th>Inscrits</th>
                                                <th>Niveau</th>
                                                <th>Statut</th>
                                                <th>Date de creation</th>
                                                <th>Action</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses?.map((course) => (
                                                <tr key={course.course_id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <img
                                                                    src={course.image}
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
                                                                <h4 className="mb-1 h6">
                                                                    <span className="text-dark">{course.title}</span>
                                                                </h4>
                                                                <ul className="list-inline fs-6 mb-0">
                                                                    <li className="list-inline-item">
                                                                        <small>
                                                                            <i className="fas fa-user"></i>
                                                                            <span className="ms-1">{course.language}</span>
                                                                        </small>
                                                                    </li>
                                                                    <li className="list-inline-item">
                                                                        <small>
                                                                            <i className="bi bi-reception-4"></i>
                                                                            <span className="ms-1">{course.level}</span>
                                                                        </small>
                                                                    </li>
                                                                    <li className="list-inline-item">
                                                                        <small>
                                                                            <i className="fas fa-dollar-sign"></i>
                                                                            <span>{course.price}</span>
                                                                        </small>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mt-3">{course.students?.length}</p>
                                                    </td>
                                                    <td>
                                                        <p className="mt-3 badge bg-success">{course.level}</p>
                                                    </td>
                                                    <td>
                                                        <p className="mt-3 badge bg-warning text-dark">Intermediaire</p>
                                                    </td>
                                                    <td>
                                                        <p className="mt-3">{moment(course.date).format("DD MMM YYYY")}</p>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm mt-3 me-1" type="button">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-danger btn-sm mt-3 me-1" type="button">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm mt-3 me-1" type="button">
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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

export default Dashboard;
