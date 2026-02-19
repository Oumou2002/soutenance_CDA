import { useEffect, useState } from "react";
import moment from "moment";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";

const typeLabelMap = {
    New_Course: "Nouveau cours",
    New_Review: "Nouvel avis",
    New_Question: "Nouvelle question",
};

function TeacherNotification() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = () => {
        useAxios.get(`teacher/noti-list/${UserData()?.teacher_id}/`).then((res) => {
            setNotifications(res.data);
        });
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsSeen = async (notificationId) => {
        const formdata = new FormData();
        formdata.append("teacher", UserData()?.teacher_id);
        formdata.append("pk", notificationId);
        formdata.append("seen", true);

        try {
            await useAxios.patch(`teacher/noti-detail/${UserData()?.teacher_id}/${notificationId}`, formdata);
            fetchNotifications();
            Toast().fire({
                icon: "success",
                title: "Notification marquee comme lue.",
            });
        } catch (error) {
            Toast().fire({
                icon: "error",
                title: "Impossible de mettre a jour la notification.",
            });
        }
    };

    const getTypeLabel = (type) => typeLabelMap[type] || type || "Notification";

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
                                        <i className="fas fa-bell"></i> Notifications
                                    </h2>
                                    <p className="workspace-subtitle">
                                        Consultez les alertes importantes liees a votre activite formateur.
                                    </p>
                                </div>
                            </div>

                            <div className="workspace-panel">
                                <div className="workspace-panel-head">
                                    <h3>Centre de notifications</h3>
                                    <p className="workspace-subtitle">
                                        Marquez les alertes traitees pour garder une vue claire.
                                    </p>
                                </div>
                                <div className="workspace-panel-body">
                                    <ul className="list-group list-group-flush">
                                        {notifications?.map((notification) => (
                                            <li
                                                className="list-group-item p-3 shadow-sm rounded-3 mb-3"
                                                key={notification.id}
                                            >
                                                <div className="d-flex justify-content-between flex-wrap gap-3 align-items-center">
                                                    <div>
                                                        <h4 className="mb-1">{getTypeLabel(notification.type)}</h4>
                                                        <p className="mb-0 text-secondary">
                                                            Date: {moment(notification.date).format("DD MMM YYYY")}
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() => handleMarkAsSeen(notification.id)}
                                                    >
                                                        Marquer comme lue <i className="fas fa-check"></i>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {notifications?.length < 1 && (
                                        <div className="workspace-empty mt-2">Aucune notification non lue.</div>
                                    )}
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

export default TeacherNotification;
