import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import PedigreeTree from "../components/UI/PedigreeTree/PedigreeTree";
import "../styles/pigeon.css";
import '../styles/custom-styles.css';
import TwoColumnTable from "../components/UI/TwoColumnTable/TwoColumnTable";
import pigeonImageStub from "../images/pigeon-image-stub.png";
import FsLightbox from "fslightbox-react";
import {AspectRatio, Button} from "@mui/joy";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";
import {AUTH_TOKEN, BEARER, PIGEONS_URL} from "../constants";
import {Stack} from "@mui/material";

const Pigeon = () => {
    let {id} = useParams();
    const [pigeon, setPigeon] = useState();
    const [images, setImages] = useState([]);
    const [openImageViewer, toggleImageViewer] = useState(false);
    const [imagesUrl, setImagesUrl] = useState([]);

    const sideEditFormRef = useRef();

    const openEditForm = () => {
        sideEditFormRef.current.toggleSideForm(true);
    }

    const handleSubmit = () => {
        fetchPigeon();
    }

    const fetchPigeon = async () => {
        try {
            const response = await fetch(PIGEONS_URL + `/${id}/with-ancestors`, {
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            });
            if (response.ok) {
                const json = await response.json();
                if (json.imageNumber && json.imageNumber > 0) {
                    const imagesListResponse = await fetch(PIGEONS_URL + `/${id}/image`, {
                        headers: {
                            "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                        }
                    });
                    if (imagesListResponse.ok) {
                        const imagesUrlList = await imagesListResponse.json();
                        setImagesUrl(imagesUrlList);
                        const imagesPromises = imagesUrlList.map(async imageUrl => {
                            const imageResponse = await fetch(imageUrl, {
                                headers: {
                                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                                }
                            });
                            if (imageResponse.ok) {
                                const blob = await imageResponse.blob();
                                return new File(
                                    [blob],
                                    imageUrl.toString().substring(imageUrl.lastIndexOf('/') + 1),
                                    {type: blob.type}
                                );
                            }
                        })
                        const images = await Promise.all(imagesPromises);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            {(pigeon && pigeon.id)
                ?
                <Container>
                    <Row>
                        <Col>
                            <h2>Номер кольца {pigeon.ringNumber}</h2>
                            <hr/>
                            <Stack direction={{xs: "column-reverse", md: "row"}} spacing={2} mb={2} alignItems="center">
                                <Stack flexBasis="60%">
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
                                </Stack>
                                <AspectRatio objectFit="contain" sx={{height: "auto", width: "80%"}} variant="plain">
                                    <img
                                        src={imagesUrl[0] ? imagesUrl[0] : pigeonImageStub}
                                        alt="Pigeon main"
                                        onClick={() => toggleImageViewer(!openImageViewer)}
                                    />
                                </AspectRatio>
                                {images[0] && <FsLightbox
                                    toggler={openImageViewer}
                                    sources={imagesUrl}
                                    type="image"
                                />}
                            </Stack>
                            <h2>Родословная</h2>
                            <hr/>
                            <PedigreeTree pigeon={pigeon}/>
                            <h2 style={{marginTop: 16}}>Зачеты</h2>
                            <hr/>
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