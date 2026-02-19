import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import useAxios from "../../utils/useAxios";

function CourseCreate() {
    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        image: "",
        file: "",
        level: "",
        language: "",
        price: "",
        category: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [categories, setCategories] = useState([]);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        useAxios.get("course/category/").then((res) => {
            setCategories(res.data);
        });
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImageUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await useAxios.post("/file-upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response?.data?.url) {
                setImagePreview(response.data.url);
                setCourseData((prev) => ({
                    ...prev,
                    image: response.data.url,
                }));
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Echec de l'envoi de l'image",
                text: "Reessayez avec un autre fichier.",
            });
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsVideoUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await useAxios.post("/file-upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response?.data?.url) {
                setCourseData((prev) => ({
                    ...prev,
                    file: response.data.url,
                }));
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Echec de l'envoi de la video",
                text: "Reessayez avec un autre fichier.",
            });
        } finally {
            setIsVideoUploading(false);
        }
    };

    const handleCourseInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCourseData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            title: courseData.title,
            description: courseData.description,
            image: courseData.image,
            file: courseData.file,
            level: courseData.level,
            language: courseData.language,
            price: courseData.price,
            category: courseData.category,
        };

        try {
            const response = await useAxios.post("teacher/course-create/", payload);
            Swal.fire({
                icon: "success",
                title: "Cours cree avec succes",
            });
            navigate(`/instructor/edit-course/${response?.data?.course_id}/`);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Creation impossible",
                text: "Verifiez les champs puis reessayez.",
            });
        }
    };

    return (
        <>
            <BaseHeader />

            <section className="workspace-shell">
                <div className="container">
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        <Sidebar />

                        <form className="col-lg-9 col-md-8 col-12" onSubmit={handleSubmit}>
                            <div className="workspace-banner mb-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div>
                                        <h1>Nouveau cours</h1>
                                        <p>Construisez votre cours avec une structure claire et un rendu professionnel.</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Link to="/instructor/courses/" className="btn btn-light">
                                            <i className="fas fa-arrow-left"></i> Retour
                                        </Link>
                                        <button className="btn btn-primary" type="submit">
                                            Creer le cours <i className="fas fa-check-circle"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="workspace-panel mb-3">
                                <div className="workspace-panel-head">
                                    <h3>Informations principales</h3>
                                    <p className="workspace-subtitle">
                                        Definissez le titre, le visuel et la description de votre cours.
                                    </p>
                                </div>
                                <div className="workspace-panel-body">
                                    <label htmlFor="preview-image" className="form-label">
                                        Apercu de la miniature
                                    </label>
                                    <img
                                        id="preview-image"
                                        style={{
                                            width: "100%",
                                            height: "320px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(13, 110, 253, 0.18)",
                                        }}
                                        className="mb-3"
                                        src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                        alt="apercu miniature"
                                    />

                                    <div className="workspace-grid">
                                        <div className="workspace-grid-full">
                                            <label htmlFor="course-thumbnail" className="form-label">
                                                Miniature du cours
                                            </label>
                                            <input
                                                id="course-thumbnail"
                                                className="form-control"
                                                type="file"
                                                name="image"
                                                onChange={handleImageUpload}
                                            />
                                            <p className="workspace-note">
                                                {isImageUploading ? "Envoi de l'image en cours..." : "Choisissez une image nette et lisible."}
                                            </p>
                                        </div>

                                        <div className="workspace-grid-full">
                                            <label htmlFor="course-intro-video" className="form-label">
                                                Video d'introduction
                                            </label>
                                            <input
                                                id="course-intro-video"
                                                className="form-control"
                                                type="file"
                                                name="file"
                                                onChange={handleFileUpload}
                                            />

                                            {courseData.file && (
                                                <p className="workspace-note mb-0">
                                                    Video prete:{" "}
                                                    <a href={courseData.file} target="_blank" rel="noreferrer">
                                                        Voir l'apercu
                                                    </a>
                                                </p>
                                            )}
                                            {!courseData.file && (
                                                <p className="workspace-note mb-0">
                                                    {isVideoUploading ? "Envoi de la video en cours..." : "Ajoutez une courte introduction de votre cours."}
                                                </p>
                                            )}
                                        </div>

                                        <div className="workspace-grid-full">
                                            <label htmlFor="course-title" className="form-label">
                                                Titre du cours
                                            </label>
                                            <input
                                                id="course-title"
                                                className="form-control"
                                                type="text"
                                                name="title"
                                                value={courseData.title}
                                                onChange={handleCourseInputChange}
                                                placeholder="Ex: React avance pour projets professionnels"
                                                required
                                            />
                                            <p className="workspace-note">Conseil: restez sous 60 caracteres.</p>
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="course-category">
                                                Categorie
                                            </label>
                                            <select
                                                id="course-category"
                                                className="form-select"
                                                name="category"
                                                value={courseData.category}
                                                onChange={handleCourseInputChange}
                                                required
                                            >
                                                <option value="">Selectionner</option>
                                                {categories?.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="course-level">
                                                Niveau
                                            </label>
                                            <select
                                                id="course-level"
                                                className="form-select"
                                                name="level"
                                                value={courseData.level}
                                                onChange={handleCourseInputChange}
                                                required
                                            >
                                                <option value="">Selectionner</option>
                                                <option value="Beginner">Debutant</option>
                                                <option value="Intemediate">Intermediaire</option>
                                                <option value="Advanced">Avance</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="course-language">
                                                Langue du cours
                                            </label>
                                            <select
                                                id="course-language"
                                                className="form-select"
                                                name="language"
                                                value={courseData.language}
                                                onChange={handleCourseInputChange}
                                                required
                                            >
                                                <option value="">Selectionner</option>
                                                <option value="French">Francais</option>
                                                <option value="English">Anglais</option>
                                                <option value="Spanish">Espagnol</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="course-price" className="form-label">
                                                Prix
                                            </label>
                                            <input
                                                id="course-price"
                                                className="form-control"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                name="price"
                                                value={courseData.price}
                                                onChange={handleCourseInputChange}
                                                placeholder="20.99"
                                                required
                                            />
                                        </div>

                                        <div className="workspace-grid-full">
                                            <label className="form-label">Description du cours</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={courseData.description || ""}
                                                onChange={(event, editor) => {
                                                    setCourseData((prev) => ({
                                                        ...prev,
                                                        description: editor.getData(),
                                                    }));
                                                }}
                                                config={{
                                                    toolbar: [
                                                        "bold",
                                                        "italic",
                                                        "link",
                                                        "bulletedList",
                                                        "numberedList",
                                                        "blockQuote",
                                                        "undo",
                                                        "redo",
                                                    ],
                                                }}
                                            />
                                            <p className="workspace-note mb-0">
                                                Racontez clairement ce que l'etudiant va apprendre.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-success w-100 py-2" type="submit">
                                Publier et continuer vers le programme <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default CourseCreate;
