import React, {useEffect, useRef, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"
import {AddRounded, ExpandMore} from "@mui/icons-material";
import {grey} from '@mui/material/colors';
import Box from "@mui/material/Box";
import Nest from "./Nest";
import OutsideTheNests from "./OutsideTheNests";
import DovecoteEditDialog from "../form/dialog/DovecoteEditDialog";
import {SECTIONS_URL} from "../../../pages/dovecote";
import SectionMenu from "../SectionMenu";
import {ButtonGroup} from "@mui/joy";

const sectionType = {
    dovecote: "DOVECOTE",
    room: "ROOM",
    nest: "NEST"
}

const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' })

const DovecoteAccordion = (props) => {

    const dovecoteDialogRef = useRef();

    const [sections, setSections] = useState(props.sections);

    useEffect(() => {
        setSections(props.sections);
    }, [props.sections]);

    const updateSectionsState = (updatedSection) => {
        if (updatedSection.sectionType === sectionType.nest) {
            setSections(prevState => {
                const updatedSections = prevState.map(section => {
                    if (section.id === updatedSection.parentId) {
                        return {
                            ...section,
                            children: [...section.children, updatedSection]
                        };
                    }
                    return section;
                });
                return updatedSections.sort(
                    (nest1, nest2) => collator.compare(nest1.name, nest2.name)
                );
            });
        } else {
            props.updateSections();
        }
    }

    const initiateSectionUpdate = (section) => {
        if (section.sectionType === sectionType.dovecote) {
            props.handleEdit(section);
            return;
        }
        dovecoteDialogRef.current.openInEditMode(section);
    }

    const handleSectionDelete = (sectionToDelete) => {
        removeSection(sectionToDelete);
    }

    const removeSection = async (section) => {
        try {
            const response = await fetch(`${SECTIONS_URL}/${section.id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                removeFromState(section);
            } else {
                props.setError({message: "Не удалось удалить секцию"})
            }
        } catch (e) {
            throw new Error("Ошибка при попытке удалить секцию", e);
        }
    }

    const removeFromState = (sectionToRemove) => {
        if (sectionToRemove.sectionType === sectionType.nest) {
            setSections(prevState => {
                const updatedSections = prevState.map(section => {
                    if (sectionToRemove.parentId === section.id) {
                        const childrenWithoutTarget = section.children.filter(itemNest => itemNest.id !== sectionToRemove.id);
                        return {...section, children: childrenWithoutTarget}
                    }
                    return section;
                })
                return updatedSections;
            });
        } else {
            props.updateSections();
        }
    }

    const colorPalette = {
        DOVECOTE: "#ddedf6",
        ROOM: "#f1faff",
    }

    return (
        <React.Fragment>
            {(sections && sections.length > 0) && sections.map(section => (
                <Accordion sx={{backgroundColor: `${colorPalette[sections[0].sectionType]}`}} key={section.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={section.id}
                        id={section.id}
                        sx={{
                            borderBottom: "1px solid rgba(0, 0, 0, .125)",
                            alignItems: "center",
                            '& .MuiAccordionSummary-content': {
                                alignItems: "center"
                            }
                    }}

                    >
                        <Typography variant="h6" sx={{flex: "0 0 33%", marginLeft: "1rem"}}>
                            {section.name}
                        </Typography>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{flex: "1 0 auto", alignItems: "center"}}
                        >
                            <Typography sx={{color: "text.secondary"}}>
                                всего голубей: {section.pigeonsNumber ? section.pigeonsNumber : "0"}
                            </Typography>
                            <ButtonGroup
                                variant="plain"
                                sx={{
                                    marginRight: "5px",
                                    "--ButtonGroup-separatorColor": "rgba(0,0,0,0) !important"
                            }}
                            >
                                <IconButton onClick={() => dovecoteDialogRef.current.openWithParentId(section.id)}>
                                    <AddRounded sx={{color: grey[500]}}/>
                                </IconButton>
                                <SectionMenu
                                    section={section}
                                    handleEdit={() => initiateSectionUpdate(section)}
                                    handleDelete={() => handleSectionDelete(section)}
                                />
                            </ButtonGroup>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{paddingTop: "16px"}}>
                        {(section.children.length > 0 && section.children[0].sectionType === "NEST")
                            ?
                            <Grid container spacing={2} columns={60}>
                                {section.children.map(nest =>
                                    <Grid xs={30} sm={20} md={15} lg={12} key={nest.id}>
                                        <Nest
                                            data={nest}
                                            handleEdit={() => initiateSectionUpdate(nest)}
                                            handleDelete={() => handleSectionDelete(nest)} />
                                    </Grid>
                                )}
                                <Grid xs={30} sm={20} md={15} lg={12}>
                                    <Box sx={{
                                        border: "1px dashed rgba(0, 0, 0, .25)",
                                        borderRadius: "0.375rem",
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"

                                    }}>
                                        <IconButton
                                            onClick={() => dovecoteDialogRef.current.openWithParentId(section.id)}
                                        >
                                            <AddRounded sx={{color: grey[500], fontSize: 80}}/>
                                        </IconButton>
                                    </Box>
                                </Grid>
                                {/*{section.pigeons && <Grid xs={60}>*/}
                                {/*    <OutsideTheNests pigeons={section.pigeons} />*/}
                                {/*</Grid>}*/}
                            </Grid>
                            :
                            <React.Fragment>
                                <DovecoteAccordion
                                    sections={section.children}
                                    updateSections={props.updateSections}
                                    setError={props.setError}
                                />
                            </React.Fragment>
                        }
                        {(section.pigeons && section.pigeons.length > 0) &&
                            <Box mt={2}><OutsideTheNests pigeons={section.pigeons}/></Box>
                        }
                    </AccordionDetails>
                </Accordion>
            ))}
            <DovecoteEditDialog
                ref={dovecoteDialogRef}
                onChange={updateSectionsState}
                handleOldValue={removeFromState}
            />
        </React.Fragment>
    );
};

export default DovecoteAccordion;