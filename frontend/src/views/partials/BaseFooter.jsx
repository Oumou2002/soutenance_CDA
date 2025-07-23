import React from "react";

function BaseFooter() {
    return (
        <footer className="pt-lg-8 pt-5 footer bg-dark text-white" style={{ marginTop: "100px" }}>
            <div className="container mt-lg-2">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 text-white">
                        {/* about company */}
                        <div className="mb-4">
                            <h1>Certiﬁcation CDA</h1>
                            <div className="mt-4">
                                <p>Certiﬁcation CDA is blablabla .</p>
                              
                            </div>
                        </div>
                    </div>
                    <div className="offset-lg-1 col-lg-2 col-md-3 col-6">
                        <div className="mb-4">
                            {/* list */}
                            <h3 className="fw-bold mb-3">Oumou poullo boddajo</h3>
                            
                        </div>
                    </div>
                  
                    <div className="col-lg-3 col-md-12">
                        {/* contact info */}
                        <div className="mb-4">
                            <h3 className="fw-bold mb-3">blablabla</h3>
                            <p>123 Rue blablabla, Paris, France</p>
                            <p className="mb-1">
                                Email:
                                <a href="#" className="text-white">
                                    {" "}
                                    oumoumamoudousow@gmail.com
                                </a>
                            </p>
                            <p>
                                Phone:
                                <span className="text-dark fw-semibold">(000) 123 456 789</span>
                            </p>
                            
                        </div>
                    </div>
                </div>
                <div className="row align-items-center g-0 border-top py-2 mt-6">
                    {/* Desc */}
                    <div className="col-md-10 col-12">
                        <div className="d-lg-flex align-items-center">
                            <div className="me-4">
                                <span>
                                    ©<span id="copyright5"></span>
                                    Certiﬁcation CDA
                                </span>
                            </div>
                           
                        </div>
                    </div>
                    {/* Links */}
                    <div className="col-12 col-md-2 d-md-flex justify-content-end">
                        <div className="dropdown">
                            <a href="#" className="dropdown-toggle text-body" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fe fe-globe me-2 align-middle" />
                                Language
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <span className="me-2">
                                            <svg width={16} height={13} viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_5543_19736)">
                                                    <path d="M0 0.5H16V12.5H0V0.5Z" fill="#012169" />
                                                    <path d="M1.875 0.5L7.975 5.025L14.05 0.5H16V2.05L10 6.525L16 10.975V12.5H14L8 8.025L2.025 12.5H0V11L5.975 6.55L0 2.1V0.5H1.875Z" fill="white" />
                                                    <path d="M10.6 7.525L16 11.5V12.5L9.225 7.525H10.6ZM6 8.025L6.15 8.9L1.35 12.5H0L6 8.025ZM16 0.5V0.575L9.775 5.275L9.825 4.175L14.75 0.5H16ZM0 0.5L5.975 4.9H4.475L0 1.55V0.5Z" fill="#C8102E" />
                                                    <path d="M6.025 0.5V12.5H10.025V0.5H6.025ZM0 4.5V8.5H16V4.5H0Z" fill="white" />
                                                    <path d="M0 5.325V7.725H16V5.325H0ZM6.825 0.5V12.5H9.225V0.5H6.825Z" fill="#C8102E" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_5543_19736">
                                                        <rect width={16} height={12} fill="white" transform="translate(0 0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        English
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <span className="me-2">
                                            <svg width={16} height={13} viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_5543_19744)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0.5H16V12.5H0V0.5Z" fill="white" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0.5H5.3325V12.5H0V0.5Z" fill="#002654" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.668 0.5H16.0005V12.5H10.668V0.5Z" fill="#CE1126" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_5543_19744">
                                                        <rect width={16} height={12} fill="white" transform="translate(0 0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        Français
                                    </a>
                                </li>
                               
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default BaseFooter;
