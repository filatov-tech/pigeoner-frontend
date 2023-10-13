import React, {useEffect, useRef, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import DovecoteAccordion from "../components/UI/DovecoteAccordion/DovecoteAccordion";
import AutocloseableErrorMessage from "../components/UI/feedback-message/AutocloseableErrorMessage";
import DovecoteEditDialog from "../components/UI/form/dialog/DovecoteEditDialog";
import {AddRounded} from "@mui/icons-material";
import {grey} from "@mui/material/colors";
import Button from "@mui/material/Button";
import {Skeleton, Stack} from "@mui/material";
import {SECTIONS_URL, HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL} from "../constants";

const Dovecote = () => {
    const editDialogRef = useRef();

    const [sections, setSections] = useState(null);
    const [otherPigeons, setOtherPigeons] = useState(null);
    const [error, setError] = useState(null);

    const handleEdit = (section) => {
        editDialogRef.current.openInEditMode(section);
    }

    const fetchSections = async () => {
        try {
            const response = await fetch(HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL);
            if (response.ok) {
                setError(null);
                const sections = await response.json();
                setOtherPigeons(sections.splice(sections.findIndex(section => section.id === null), 1))
                setSections(sections)
            } else {
                setError(await response.json())
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке голубятен и секций", e);
        }
    }

    const removeSection = async (section) => {
        try {
            const response = await fetch(`${SECTIONS_URL}/${section.id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                setError({message: "Не удалось удалить секцию"})
            }
        } catch (e) {
            throw new Error("Ошибка при попытке удалить секцию", e);
        }
        fetchSections();
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
                    {sections
                        ?
                        <React.Fragment>
                            <DovecoteAccordion
                                sections={sections}
                                editDialogRef={editDialogRef}
                                updateSections={fetchSections}
                                handleEdit={handleEdit}
                                handleDelete={removeSection}
                                setError={setError}
                            />
                            {otherPigeons &&
                                <DovecoteAccordion
                                    sections={otherPigeons}
                                    editDialogRef={editDialogRef}
                                    updateSections={fetchSections}
                                    handleEdit={handleEdit}
                                    handleDelete={removeSection}
                                    setError={setError}
                                    editDisabled
                                />
                            }
                        </React.Fragment>
                        :
                        <Stack spacing={1}>
                            <Skeleton variant="rectangular" height={64} />
                            <Skeleton variant="rectangular" height={64} sx={{bgcolor: "grey.300"}} />
                            <Skeleton variant="rectangular" height={64} sx={{bgcolor: "grey.200"}} />
                            <Skeleton variant="rectangular" height={64} sx={{bgcolor: "grey.100"}} />
                        </Stack>
                    }
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
                    <DovecoteEditDialog
                        ref={editDialogRef}
                        onSubmit={[fetchSections]}
                    />
                    {error && <AutocloseableErrorMessage error={error} setError={setError} timeout={4000} />}
                </Col>
            </Row>
        </Container>);
};

export default Dovecote;