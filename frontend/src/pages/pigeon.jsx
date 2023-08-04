import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import PedigreeTree from "../components/UI/PedigreeTree/PedigreeTree";
import "../styles/pigeon.css";
import '../styles/custom-styles.css';
import TwoColumnTable from "../components/UI/TwoColumnTable/TwoColumnTable";
import pigeonSmallImageStub from "../images/pigeon-small-image-stub.png";
import pigeonImageStub from "../images/pigeon-image-stub.png";
import arrowUp from "../images/arrow-up.png";
import arrowDown from "../images/arrow-down.png";



const Pigeon = () => {
    let { id } = useParams();
    const [pigeon, setPigeon] = useState();

    useEffect(() => {
        fetch(`/api/v1/pigeons/${id}/with-ancestors`)
            .then(res => res.json())
            .then(json => setPigeon(json))
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
                                        <div className="image-box">
                                            <div className="main-image">
                                                <img src={pigeonImageStub} alt="pigeon-stub"/>
                                            </div>
                                            <div className="up-list">
                                                <img src={arrowUp} alt="arrow-up" width={100}/>
                                            </div>
                                            <div className="first-additional-image">
                                                <img src={pigeonSmallImageStub} alt="small-stub"/>
                                            </div>
                                            <div className="second-additional-image">
                                                <img src={pigeonSmallImageStub} alt="small-stub"/>
                                            </div>
                                            <div className="third-additional-image">
                                                <img src={pigeonSmallImageStub} alt="small-stub"/>
                                            </div>
                                            <div className="down-list">
                                                <img src={arrowDown} alt="arrow-down" width={100}/>
                                            </div>
                                        </div>
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