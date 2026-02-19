import { useEffect, useState } from "react";
import moment from "moment";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import { teacherId } from "../../utils/constants";
import Toast from "../plugin/Toast";

function Review() {
    const [reviews, setReviews] = useState([]);
    const [replyByReview, setReplyByReview] = useState({});
    const [filteredReviews, setFilteredReview] = useState([]);

    const fetchReviewsData = () => {
        useAxios.get(`teacher/review-lists/${teacherId}/`).then((res) => {
            setReviews(res.data);
            setFilteredReview(res.data);
        });
    };

    useEffect(() => {
        fetchReviewsData();
    }, []);

    const handleSubmitReply = async (reviewId) => {
        const reply = (replyByReview[reviewId] || "").trim();
        if (!reply) {
            Toast().fire({
                icon: "warning",
                title: "Ecrivez une reponse avant l'envoi.",
            });
            return;
        }

        try {
            await useAxios.patch(`teacher/review-detail/${teacherId}/${reviewId}/`, { reply });
            fetchReviewsData();
            Toast().fire({
                icon: "success",
                title: "Reponse envoyee.",
            });
            setReplyByReview((prev) => ({ ...prev, [reviewId]: "" }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSortByDate = (e) => {
        const sortValue = e.target.value;
        const sortedReview = [...filteredReviews];

        if (sortValue === "Plus récent") {
            sortedReview.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortValue === "Plus ancien") {
            sortedReview.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setFilteredReview(sortedReview);
    };

    const handleSortByRatingChange = (e) => {
        const rating = parseInt(e.target.value, 10);
        if (rating === 0) {
            fetchReviewsData();
            return;
        }

        const filtered = reviews.filter((review) => review.rating === rating);
        setFilteredReview(filtered);
    };

    const handleFilterByCourse = (e) => {
        const query = e.target.value.toLowerCase();
        if (query === "") {
            fetchReviewsData();
            return;
        }

        const filtered = reviews.filter((review) =>
            review.course.title.toLowerCase().includes(query),
        );
        setFilteredReview(filtered);
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
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Avis</h3>
                                        <span>Consultez et repondez aux avis de vos etudiants.</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <form className="row mb-4 gx-2">
                                        <div className="col-xl-7 col-lg-6 col-md-4 col-12 mb-2 mb-lg-0">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Rechercher par cours"
                                                onChange={handleFilterByCourse}
                                            />
                                        </div>
                                        <div className="col-xl-2 col-lg-2 col-md-4 col-12 mb-2 mb-lg-0">
                                            <select className="form-select" onChange={handleSortByRatingChange}>
                                                <option value={0}>Note</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                        </div>
                                        <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-2 mb-lg-0">
                                            <select className="form-select" onChange={handleSortByDate}>
                                                <option value="">Trier par</option>
                                                <option value="Plus récent">Plus recent</option>
                                                <option value="Plus ancien">Plus ancien</option>
                                            </select>
                                        </div>
                                    </form>

                                    <ul className="list-group list-group-flush">
                                        {filteredReviews?.map((review) => (
                                            <li className="list-group-item p-4 shadow rounded-3 mb-4" key={review.id}>
                                                <div className="d-flex">
                                                    <img
                                                        src={review.profile.image}
                                                        alt="avatar"
                                                        className="rounded-circle avatar-lg"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0">{review.profile.full_name}</h4>
                                                                <span>{moment(review.date).format("DD MMM YYYY")}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="fs-6 me-1 align-top">
                                                                <Rater total={5} rating={review.rating || 0} />
                                                            </span>
                                                            <span className="me-1">pour</span>
                                                            <span className="h5">{review.course?.title}</span>
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Avis <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {review.review}
                                                            </p>
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Reponse <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {review.reply || "Aucune reponse"}
                                                            </p>
                                                            <p>
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#collapse${review.id}`}
                                                                    aria-expanded="false"
                                                                    aria-controls={`collapse${review.id}`}
                                                                >
                                                                    Repondre
                                                                </button>
                                                            </p>
                                                            <div className="collapse" id={`collapse${review.id}`}>
                                                                <div className="card card-body">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Votre reponse
                                                                        </label>
                                                                        <textarea
                                                                            cols="30"
                                                                            className="form-control"
                                                                            rows="4"
                                                                            value={replyByReview[review.id] || ""}
                                                                            onChange={(e) =>
                                                                                setReplyByReview((prev) => ({
                                                                                    ...prev,
                                                                                    [review.id]: e.target.value,
                                                                                }))
                                                                            }
                                                                        ></textarea>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary"
                                                                        onClick={() => handleSubmitReply(review.id)}
                                                                    >
                                                                        Envoyer la reponse{" "}
                                                                        <i className="fas fa-paper-plane"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}

                                        {filteredReviews?.length < 1 && (
                                            <p className="mt-4 p-3">Aucun avis.</p>
                                        )}
                                    </ul>
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

export default Review;
