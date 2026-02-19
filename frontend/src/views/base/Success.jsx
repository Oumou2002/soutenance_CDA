import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import apiInstance from "../../utils/axios";

function Success() {
    const [orderMessage, setOrderMessage] = useState("");
    const param = useParams();
    const urlParam = new URLSearchParams(window.location.search);
    const sessionId = urlParam.get("session_id");
    const paypalOrderId = urlParam.get("paypal_order_id");

    useEffect(() => {
        const formdata = new FormData();
        formdata.append("order_oid", param.order_oid);
        formdata.append("session_id", sessionId);
        formdata.append("paypal_order_id", paypalOrderId);

        setOrderMessage("Processing Payment");

        apiInstance
            .post("payment/payment-sucess/", formdata)
            .then((res) => {
                setOrderMessage(res.data?.message || "Payment Failed");
            })
            .catch((error) => {
                console.log(error);
                setOrderMessage("Payment Failed");
            });
    }, [param.order_oid, paypalOrderId, sessionId]);

    return (
        <>
            <BaseHeader />

            <section className="pt-0 position-relative overflow-hidden my-auto">
                <div className="container position-relative py-5">
                    <div className="row g-5 align-items-center justify-content-center">
                        {(orderMessage === "Payment Successfull" || orderMessage === "Already Paid") && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-success">Inscription reussie !</h1>
                                    <p>
                                        Le paiement est valide. Rendez-vous sur votre tableau de bord pour commencer le
                                        cours.
                                    </p>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img
                                        src="https://i.pinimg.com/originals/0d/e4/1a/0de41a3c5953fba1755ebd416ec109dd.gif"
                                        className="h-300px h-sm-400px h-md-500px h-xl-700px"
                                        alt="Paiement reussi"
                                    />
                                </div>
                            </>
                        )}

                        {orderMessage === "Processing Payment" && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-warning">
                                        Traitement du paiement{" "}
                                        <i className="fas fa-spinner fa-spin"></i>
                                    </h1>
                                    <p>Veuillez patienter pendant la confirmation de votre paiement.</p>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img
                                        src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1259.gif"
                                        className="h-300px h-sm-400px h-md-500px h-xl-700px"
                                        alt="Traitement du paiement"
                                    />
                                </div>
                            </>
                        )}

                        {orderMessage === "Payment Failed" && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-danger">Paiement echoue</h1>
                                    <p>
                                        Votre paiement n'a pas pu etre valide.
                                        <br />
                                        Veuillez reessayer.
                                    </p>
                                    <button type="button" className="btn btn-danger mb-0 rounded-2">
                                        Reessayer <i className="fas fa-repeat"></i>
                                    </button>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img
                                        src="https://media3.giphy.com/media/h4OGa0npayrJX2NRPT/giphy.gif?cid=790b76117pc6298jypyph0liy6xlp3lzb7b2y405ixesujeu&ep=v1_stickers_search&rid=giphy.gif&ct=e"
                                        className="h-300px h-sm-400px h-md-500px h-xl-700px"
                                        alt="Paiement echoue"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Success;
