import React, {useEffect, useRef, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import DovecoteAccordion from "../components/UI/DovecoteAccordion/DovecoteAccordion";
import AutocloseableErrorMessage from "../components/UI/feedback-message/AutocloseableErrorMessage";
import DovecoteEditDialog from "../components/UI/form/dialog/DovecoteEditDialog";
import {AddRounded} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import Button from "@mui/material/Button";

export const SECTIONS_URL = "/api/v1/sections";
export const HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL = SECTIONS_URL + "/hierarchical-with-pigeons";

const Dovecote = () => {
    const editDialogRef = useRef();

    const [sections, setSections] = useState(null);
    const [error, setError] = useState(null);

    const handleEdit = (section) => {
        editDialogRef.current.openInEditMode(section);
    }

    const fetchSections = async () => {
        try {
            const response = await fetch(HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL);
            if (response.ok) {
                setError(null);
                setSections(await response.json())
            } else {
                setError(await response.json())
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке голубятен и секций", e);
        }
    }

    useEffect(() => {
        fetchSections()
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Голубятня</h1>
                    <hr/>
                    {sections && <DovecoteAccordion
                        sections={sections}
                        updateSections={fetchSections}
                        handleEdit={handleEdit}
                        setError={setError}
                    />}
                    <Button
                        startIcon={<AddRounded />}
                        onClick={() => editDialogRef.current.openForDovecoteCreation()}
                        variant
                        sx={{
                            width: "100%",
                            height: "64px",
                            marginTop: 2,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            border: "1px dashed rgba(0, 0, 0, .25)",
                            borderRadius: "0.375rem",
                            textTransform: "none",
                            paddingLeft: "2rem",
                            fontSize: "1.25rem",
                            color: grey[600]
                        }}
                    >
                        Добавить голубятню
                    </Button>
                    <DovecoteEditDialog ref={editDialogRef} onChange={() => fetchSections()}/>
                    {error && <AutocloseableErrorMessage error={error} setError={setError} timeout={4000} />}
                </Col>
            </Row>
        </Container>);
};

export default Dovecote;