import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";

function Search() {
    const [courses, setCourses] = useState([]);
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const fetchCourse = async () => {
        try {
            const res = await useAxios.get("/course/course-list/");
            setCourses(res.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return courses;
        return courses.filter((course) => course.title?.toLowerCase().includes(query));
    }, [courses, searchQuery]);

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
            await useAxios.post(`student/wishlist/${UserData()?.user_id}/`, formdata);
            Toast().fire({
                icon: "success",
                title: "Cours ajoute aux favoris.",
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

            <section className="mb-5 py-5">
                <div className="container mb-lg-4">
                    <div className="glass-panel p-4 p-lg-5">
                        <div className="row g-3 align-items-end">
                            <div className="col-lg-8">
                                <h2 className="mb-1 h1">Resultats pour: "{searchQuery || "Aucune recherche"}"</h2>
                                <p className="text-secondary mb-0">
                                    {filteredCourses.length} cours trouves
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher un cours..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-2">
                        {filteredCourses?.map((c, index) => (
                            <div className="col" key={index}>
                                <div className="card card-hover h-100">
                                    <Link to={`/course-detail/${c.slug}/`}>
                                        <img
                                            src={c.image}
                                            alt="cours"
                                            className="card-img-top"
                                            style={{
                                                width: "100%",
                                                height: "200px",
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

                                    <div className="card-footer">
                                        <div className="row align-items-center g-0">
                                            <div className="col">
                                                <h5 className="mb-0">${c.price}</h5>
                                            </div>
                                            <div className="col-auto">
                                                <Link
                                                    to={`/course-detail/${c.slug}/`}
                                                    className="text-inherit text-decoration-none btn btn-primary"
                                                >
                                                    Voir le cours{" "}
                                                    <i className="fas fa-arrow-right text-white align-middle ms-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Search;
