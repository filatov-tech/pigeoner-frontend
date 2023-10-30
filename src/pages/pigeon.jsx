import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import PedigreeTree from "../components/UI/PedigreeTree/PedigreeTree";
import "../styles/pigeon.css";
import '../styles/custom-styles.css';
import TwoColumnTable from "../components/UI/TwoColumnTable/TwoColumnTable";
import pigeonImageStub from "../images/pigeon-image-stub.png";
import FsLightbox from "fslightbox-react";
import {AspectRatio, Button} from "@mui/joy";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";
import {AUTH_TOKEN, BEARER, PIGEONS_URL, PRODUCTION} from "../constants";
import {Stack} from "@mui/material";
import {DeleteOutline} from "@mui/icons-material";
import SimpleDeletionConfirmDialog from "../components/UI/form/confirm-action/SimpleDeletionConfirmDialog";

const Pigeon = () => {
    const navigate = useNavigate();

    let {id} = useParams();
    const [pigeon, setPigeon] = useState();
    const [images, setImages] = useState([]);
    const [openImageViewer, toggleImageViewer] = useState(false);
    const [imagesUrl, setImagesUrl] = useState([]);
    const [openDeletionConfirmDialog, setOpenDeletionConfirmDialog] = useState(false);

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
                        let imagesUrlList = await imagesListResponse.json();
                        if (process.env.NODE_ENV ===  PRODUCTION) {
                            imagesUrlList = imagesUrlList.map(url => url.replace("http:", "https:"));
                        }
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
                        const imagesUrl = images.map(image => URL.createObjectURL(image));
                        setImagesUrl(imagesUrl);
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

    const handleDelete = async () => {
        try {
            const response = await fetch(PIGEONS_URL + `/${pigeon.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            });
            if (response.ok) {
                navigate("/pigeons");
            }
        } catch (e) {
            throw new Error("Ошибка при попытке удалить голубя");
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
                                    <Stack direction="row" spacing={1}>
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
                                        <Button
                                            variant="soft"
                                            color="danger"
                                            onClick={() => setOpenDeletionConfirmDialog(true)}
                                        >
                                            <DeleteOutline fontSize="small"/>
                                        </Button>
                                        <SimpleDeletionConfirmDialog
                                            open={openDeletionConfirmDialog}
                                            setOpen={setOpenDeletionConfirmDialog}
                                            handleDelete={handleDelete}
                                            title="Удалить голубя"
                                            content="Вы уверены, что хотите удалить голубя? Будут удалены все его изображания и связи с другими особями"
                                        />
                                    </Stack>
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
                            {pigeon && <PedigreeTree pigeon={pigeon} reloadPedigree={fetchPigeon}/>}
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