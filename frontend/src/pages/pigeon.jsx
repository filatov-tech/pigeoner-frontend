import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import PedigreeTree from "../components/UI/PedigreeTree/PedigreeTree";
import "../styles/pigeon.css";
import '../styles/custom-styles.css';
import TwoColumnTable from "../components/UI/TwoColumnTable/TwoColumnTable";
import pigeonImageStub from "../images/pigeon-image-stub.png";
import FsLightbox from "fslightbox-react";

const Pigeon = () => {
    let { id } = useParams();
    const [pigeon, setPigeon] = useState();
    const [images, setImages] = useState([]);
    const [openImageViewer, toggleImageViewer] = useState(false);

    useEffect(() => {
        fetch(`/api/v1/pigeons/${id}/with-ancestors`)
            .then(res => res.json())
            .then(json => setPigeon(json));
        fetch(`/api/v1/pigeon/${id}/image`)
            .then(res => res.json())
            .then(json => setImages(json));
    },[id]);
    
    return (
        <>
            {pigeon
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
                                    </div>
                                    <div className="pigeon-photo">
                                        <img
                                            src={images[0] ? images[0] : pigeonImageStub}
                                            alt="Pigeon main photo"
                                            onClick={() => toggleImageViewer(!openImageViewer)}
                                            style={{height: "100%", width: "100%"}}
                                        />
                                        {images && <FsLightbox
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