import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";
import apiInstance from "../../utils/axios";

function Index() {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchCourse = async () => {
        try {
            const res = await apiInstance.get("/course/course-list/");
            setCourses(res.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    const totalPages = Math.max(1, Math.ceil(courses.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const courseStats = useMemo(() => {
        const totalStudents = courses.reduce((sum, course) => sum + (course.students?.length || 0), 0);
        const avgRating =
            courses.length > 0
                ? (
                      courses.reduce((sum, course) => sum + Number(course.average_rating || 0), 0) / courses.length
                  ).toFixed(1)
                : "0.0";

        return {
            totalCourses: courses.length,
            totalStudents,
            avgRating,
        };
    }, [courses]);

    const addToWishlist = async (courseId) => {
        if (!UserData()?.user_id) {
            Toast().fire({
                icon: "warning",
                title: "Connectez-vous pour ajouter ce cours aux favoris.",
            });
            return;
        }

        const formdata = new FormData();
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("course_id", courseId);

        try {
            const res = await apiInstance.post(`student/wishlist/${UserData()?.user_id}/`, formdata);
            Toast().fire({
                icon: "success",
                title: res.data?.message || "Ajoute aux favoris.",
            });
        } catch (error) {
            console.log(error);
            Toast().fire({
                icon: "error",
                title: "Impossible d'ajouter ce cours aux favoris.",
            });
        }
    };

    return (
        <>
            <BaseHeader />

            <section className="py-5">
                <div className="container my-4 my-lg-5">
                    <div className="hero-modern">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-7">
                                <span className="hero-chip mb-3">
                                    <i className="fas fa-bolt" />
                                    Plateforme de formation professionnelle
                                </span>
                                <h1 className="display-5 fw-bold mb-3">Passe de l'apprentissage a la maitrise.</h1>
                                <p className="mb-4 text-secondary">
                                    Decouvre des parcours structures, suis ta progression en direct et avance avec des
                                    contenus concrets, orientés resultat.
                                </p>
                                <div className="d-flex flex-wrap gap-2">
                                    <Link to="/search/" className="btn btn-primary">
                                        Explorer les cours <i className="fas fa-arrow-right ms-1" />
                                    </Link>
                                    <Link to="/register/" className="btn btn-outline-success">
                                        Creer un compte
                                    </Link>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="hero-stat-grid">
                                    <div className="hero-stat">
                                        <p>Cours publies</p>
                                        <h4>{courseStats.totalCourses}</h4>
                                    </div>
                                    <div className="hero-stat">
                                        <p>Apprenants inscrits</p>
                                        <h4>{courseStats.totalStudents}</h4>
                                    </div>
                                    <div className="hero-stat">
                                        <p>Note moyenne</p>
                                        <h4>{courseStats.avgRating}/5</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-5">
                <div className="container mb-lg-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                        <h2 className="h3 mb-0 fw-bold">Cours a la une</h2>
                        <Link to="/search/" className="btn btn-outline-success">
                            Voir tout le catalogue
                        </Link>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        {currentItems?.map((c, index) => (
                            <div className="col" key={index}>
                                <div className="card card-hover h-100">
                                    <Link to={`/course-detail/${c.slug}/`}>
                                        <img
                                            src={c.image}
                                            alt="cours"
                                            className="card-img-top"
                                            style={{
                                                width: "100%",
                                                height: "210px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Link>

                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <span className="badge bg-info">{c.level}</span>
                                                <span className="badge bg-success ms-2">{c.language}</span>
                                            </div>
                                            <button
                                                onClick={() => addToWishlist(c.id)}
                                                className="btn btn-sm btn-light"
                                                type="button"
                                            >
                                                <i className="fas fa-heart text-danger align-middle" />
                                            </button>
                                        </div>

                                        <h4 className="mb-2 text-truncate-line-2">
                                            <Link
                                                to={`/course-detail/${c.slug}/`}
                                                className="text-inherit text-decoration-none text-dark fs-5"
                                            >
                                                {c.title}
                                            </Link>
                                        </h4>

                                        <small>Par : {c.teacher?.full_name}</small>
                                        <br />
                                        <small>
                                            {c.students?.length} etudiant{c.students?.length > 1 ? "s" : ""}
                                        </small>
                                        <br />

                                        <div className="lh-1 mt-3 d-flex align-items-center">
                                            <span className="align-text-top me-2">
                                                <span className="fs-6">
                                                    <Rater total={5} rating={c.average_rating || 0} />
                                                </span>
                                            </span>
                                            <span className="text-warning fw-semibold">
                                                {Number(c.average_rating || 0).toFixed(1)}
                                            </span>
                                            <span className="fs-6 ms-2">({c.reviews?.length} avis)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <nav className="d-flex mt-5">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link me-1"
                                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    type="button"
                                >
                                    <i className="ci-arrow-left me-2" />
                                    Precedent
                                </button>
                            </li>
                        </ul>

                        <ul className="pagination">
                            {pageNumbers.map((number) => (
                                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(number)} type="button">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link ms-1"
                                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                    type="button"
                                >
                                    Suivant
                                    <i className="ci-arrow-right ms-3" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Index;
