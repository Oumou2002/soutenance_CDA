import { useEffect, useState } from "react";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import { Link } from "react-router-dom";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";


import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";

import apiInstance from "../../utils/axios";

function Index() {
    const [courses, setCourses] = useState([]);
   // const [ setIsLoading] = useState(true);
   

   

    const fetchCourse = async () => {
        //setIsLoading(true);
        try {
            await apiInstance.get(`/course/course-list/`).then((res) => {
                setCourses(res.data);
                //setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

  

    // Pagination
    const itemsPerPage = 1;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const addToWishlist = (courseId) => {
        const formdata = new FormData();
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("course_id", courseId);

        apiInstance.post(`student/wishlist/${UserData()?.user_id}/`, formdata).then((res) => {
            console.log(res.data);
            Toast().fire({
                icon: "success",
                title: res.data.message,
            });
        });
    };

    return (
        <>
            <BaseHeader />

            <section className="py-lg-8 py-5">
                {/* container */}
                <div className="container my-lg-8">
                    {/* row */}
                    <div className="row align-items-center">
                        {/* col */}
                        <div className="col-lg-6 mb-6 mb-lg-0">
                            <div>
                                {/* heading */}
                                <h5 className="text-dark mb-4">
                                    <i className="fe fe-check icon-xxs icon-shape bg-light-success text-success rounded-circle me-2" />
                                    Desription du project
                                </h5>
                                {/* heading */}
                                <h1 className="display-3 fw-bold mb-3">  Desription du project .....</h1>
                                {/* para */}
                                <p className="pe-lg-10 mb-5">  Desription du project................</p>
                                
                               
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

            
            <section className="mb-5">
                <div className="container mb-lg-8 ">
                    
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                {currentItems?.map((c, index) => (
                                    <div className="col" key={index}>
                                        {/* Card */}
                                        <div className="card card-hover">
                                            <Link to={`/course-detail/${c.slug}/`}>
                                                <img
                                                    src={c.image}
                                                    alt="course"
                                                    className="card-img-top"
                                                    style={{
                                                        width: "100%",
                                                        height: "200px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Link>
                                            {/* Card Body */}
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <span className="badge bg-info">{c.level}</span>
                                                        <span className="badge bg-success ms-2">{c.language}</span>
                                                    </div>
                                                    <a onClick={() => addToWishlist(c.id)} className="fs-5">
                                                        <i className="fas fa-heart text-danger align-middle" />
                                                    </a>
                                                </div>
                                                <h4 className="mb-2 text-truncate-line-2 ">
                                                    <Link to={`/course-detail/slug/`} className="text-inherit text-decoration-none text-dark fs-5">
                                                        {c.title}
                                                    </Link>
                                                </h4>
                                                <small>By: {c.teacher.full_name}</small> <br />
                                                <small>
                                                    {c.students?.length} Student
                                                    {c.students?.length > 1 && "s"}
                                                </small>{" "}
                                                <br />
                                                <div className="lh-1 mt-3 d-flex">
                                                    <span className="align-text-top">
                                                        <span className="fs-6">
                                                            <Rater total={5} rating={c.average_rating || 0} />
                                                        </span>
                                                    </span>
                                                    <span className="text-warning">4.5</span>
                                                    <span className="fs-6 ms-2">({c.reviews?.length} Reviews)</span>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <nav className="d-flex mt-5">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                                            <i className="ci-arrow-left me-2" />
                                            Previous
                                        </button>
                                    </li>
                                </ul>
                                <ul className="pagination">
                                    {pageNumbers.map((number) => (
                                        <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(number)}>
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                                            Next
                                            <i className="ci-arrow-right ms-3" />
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            

           
            <BaseFooter />
        </>
    );
}

export default Index;
