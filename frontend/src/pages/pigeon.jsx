import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import PedigreeTree from "../components/UI/PedigreeTree/PedigreeTree";
import "../styles/pigeon.css";
import '../styles/custom-styles.css';
import TwoColumnTable from "../components/UI/TwoColumnTable/TwoColumnTable";
import pigeonImageStub from "../images/pigeon-image-stub.png";
import FsLightbox from "fslightbox-react";
import {Button} from "@mui/joy";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";

const Pigeon = () => {
    let { id } = useParams();
    const [pigeon, setPigeon] = useState();
    const [images, setImages] = useState([]);
    const [openImageViewer, toggleImageViewer] = useState(false);

    const sideEditFormRef = useRef();

    const openEditForm = () => {
        sideEditFormRef.current.toggleSideForm(true);
    }

    const handleSubmit = () => {
        fetchPigeon();
    }

    const fetchPigeon = async () => {
        try {
            const response = await fetch(`/api/v1/pigeons/${id}/with-ancestors`);
            if (response.ok) {
                const json = await response.json();
                if (json.imageNumber && json.imageNumber > 0) {
                    const responseWithImages = await fetch(`/api/v1/pigeon/${id}/image`);
                    if (responseWithImages.ok) {
                        const images = await responseWithImages.json();
                        setImages(images);
                        json.images = images;
                    } else {
                        console.log("Не удалось загрузить фото")
                    }
                }
                setPigeon(json);
            }
        } catch (e) {
            console.log("Ошибка при загрузке голубя", e)
        }
    }

    useEffect(() => {
        fetchPigeon();
    },[id]);

    return (
        <>
            {(pigeon && pigeon.id)
                ?
                <Container>
                    <Row>
                        <Col>
                            <div className="pigeon-content">
                                <div className="main-info">
                                    <div className="main-head">
                                        <h2>Номер кольца {pigeon.ringNumber}</h2>
                                        <hr/>
                                    </div>
                                    <div className="pigeon-data">
                                        <TwoColumnTable pigeon={pigeon}/>
                                        <Button
                                            variant="soft"
                                            size="lg"
                                            onClick={openEditForm}
                                            sx={{width: "100%"}}
                                        >
                                            Изменить данные
                                        </Button>
                                        <PigeonSideEditForm
                                            pigeon={pigeon}
                                            handleSubmit={handleSubmit}
                                            ref={sideEditFormRef}
                                        />
                                    </div>
                                    <div className="pigeon-photo">
                                        <img
                                            src={images[0] ? images[0] : pigeonImageStub}
                                            alt="Pigeon main photo"
                                            onClick={() => toggleImageViewer(!openImageViewer)}
                                            style={{height: "auto", width: "60%"}}
                                        />
                                        {images[0] && <FsLightbox
                                            toggler={openImageViewer}
                                            sources={images}
                                            type="image"
                                        />}
                                    </div>
                                </div>
                                <div className="pedigree-container">
                                    <div className="pedigree-head">
                                        <h2>Родословная</h2>
                                        <hr/>
                                    </div>
                                    <div className="pedigree-tree-box">
                                        <PedigreeTree pigeon={pigeon}/>
                                    </div>
                                </div>
                                <div className="flight-container">
                                    <div className="flight-head">
                                        <h2>Зачеты</h2>
                                        <hr/>
                                    </div>
                                    <div className="flight-box"></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                :
                <div className="spinner-border text-primary m-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
        </>
    );
};

export default Pigeon;