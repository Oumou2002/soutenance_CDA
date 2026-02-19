import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";

function QA() {
    const [questions, setQuestions] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationShow, setConversationShow] = useState(false);
    const [createMessage, setCreateMessage] = useState({ title: "", message: "" });
    const lastElementRef = useRef();

    const fetchQuestions = () => {
        useAxios.get(`teacher/question-answer-list/${UserData()?.teacher_id}/`).then((res) => {
            setQuestions(res.data);
        });
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (lastElementRef.current) {
            lastElementRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedConversation]);

    const handleConversationClose = () => setConversationShow(false);

    const handleConversationShow = (conversation) => {
        setSelectedConversation(conversation);
        setConversationShow(true);
    };

    const handleMessageChange = (event) => {
        setCreateMessage({
            ...createMessage,
            [event.target.name]: event.target.value,
        });
    };

    const sendNewMessage = (e) => {
        e.preventDefault();
        if (!selectedConversation?.course) return;

        const formdata = new FormData();
        formdata.append("course_id", selectedConversation.course);
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("message", createMessage.message);
        formdata.append("qa_id", selectedConversation.qa_id);

        useAxios.post("student/question-answer-message-create/", formdata).then((res) => {
            setSelectedConversation(res.data.question);
            setCreateMessage((prev) => ({ ...prev, message: "" }));
        });
    };

    const handleSearchQuestion = (event) => {
        const query = event.target.value.toLowerCase();
        if (query === "") {
            fetchQuestions();
            return;
        }

        const filtered = questions.filter((question) =>
            question.title.toLowerCase().includes(query),
        );
        setQuestions(filtered);
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
                            <h4 className="mb-0 mb-1">
                                <i className="fas fa-envelope"></i> Questions et reponses
                            </h4>

                            <div className="card">
                                <div className="card-header border-bottom p-0 pb-3">
                                    <h4 className="mb-3 p-3">Discussions</h4>
                                    <form className="row g-4 p-3">
                                        <div className="col-sm-12 col-lg-12">
                                            <div className="position-relative">
                                                <input
                                                    className="form-control pe-5 bg-transparent"
                                                    type="search"
                                                    placeholder="Rechercher une question"
                                                    aria-label="Rechercher une question"
                                                    onChange={handleSearchQuestion}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="card-body p-0 pt-3">
                                    <div className="vstack gap-3 p-3">
                                        {questions?.map((question) => (
                                            <div className="shadow rounded-3 p-3" key={question.qa_id}>
                                                <div className="d-sm-flex justify-content-sm-between mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-sm flex-shrink-0">
                                                            <img
                                                                src={question.profile.image}
                                                                className="avatar-img rounded-circle"
                                                                alt="avatar"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    borderRadius: "50%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-2">
                                                            <h6 className="mb-0">
                                                                <span className="text-dark">{question.profile.full_name}</span>
                                                            </h6>
                                                            <small>{moment(question.date).format("DD MMM YYYY")}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h5>
                                                    {question.title}{" "}
                                                    <span className="badge bg-success">{question.messages?.length}</span>
                                                </h5>
                                                <button
                                                    className="btn btn-primary btn-sm mb-3 mt-3"
                                                    onClick={() => handleConversationShow(question)}
                                                    type="button"
                                                >
                                                    Ouvrir la conversation{" "}
                                                    <i className="fas fa-arrow-right"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={conversationShow} size="lg" onHide={handleConversationClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lecon: {selectedConversation?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="border p-2 p-sm-4 rounded-3">
                        <ul className="list-unstyled mb-0" style={{ overflowY: "scroll", height: "500px" }}>
                            {selectedConversation?.messages?.map((message) => (
                                <li className="comment-item mb-3" key={message.id}>
                                    <div className="d-flex">
                                        <div className="avatar avatar-sm flex-shrink-0">
                                            <img
                                                className="avatar-img rounded-circle"
                                                src={
                                                    message.profile.image?.startsWith("http://127.0.0.1:8000")
                                                        ? message.profile.image
                                                        : `http://127.0.0.1:8000${message.profile.image}`
                                                }
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                                alt="photo utilisateur"
                                            />
                                        </div>
                                        <div className="ms-2">
                                            <div className="bg-light p-3 rounded w-100">
                                                <div className="d-flex w-100 justify-content-center">
                                                    <div className="me-2">
                                                        <h6 className="mb-1 lead fw-bold">
                                                            <span className="text-dark">{message.profile.full_name}</span>
                                                            <br />
                                                            <span style={{ fontSize: "12px", color: "gray" }}>
                                                                {moment(message.date).format("DD MMM YYYY")}
                                                            </span>
                                                        </h6>
                                                        <p className="mb-0 mt-3">{message.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}

                            <div ref={lastElementRef}></div>
                        </ul>

                        <form className="w-100 d-flex" onSubmit={sendNewMessage}>
                            <textarea
                                name="message"
                                className="one form-control pe-4 bg-light w-75"
                                id="autoheighttextarea"
                                rows="2"
                                onChange={handleMessageChange}
                                value={createMessage.message}
                                placeholder="Ecrivez votre message..."
                            ></textarea>
                            <button className="btn btn-primary ms-2 mb-0 w-25" type="submit">
                                Envoyer <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <BaseFooter />
        </>
    );
}

export default QA;
