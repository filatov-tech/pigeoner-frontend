import React, {useEffect, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, IconButton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"
import {AddRounded, ExpandMore} from "@mui/icons-material";
import {grey} from '@mui/material/colors';
import Box from "@mui/material/Box";
import Nest from "./Nest";
import OutsideTheNests from "./OutsideTheNests";
import SectionMenu from "../SectionMenu";
import {ButtonGroup} from "@mui/joy";

const sectionType = {
    DOVECOTE: "DOVECOTE",
    ROOM: "ROOM",
    NEST: "NEST"
}

const DovecoteAccordion = (props) => {

    const [sections, setSections] = useState(props.sections);

    useEffect(() => {
        setSections(props.sections);
    }, [props.sections]);

    const colorPalette = {
        DOVECOTE: "#ddedf6",
        ROOM: "#f1faff",
    }

    const handleAddSection = (parentId, type) => {
        const addedSectionType = type === sectionType.DOVECOTE ? sectionType.ROOM : sectionType.NEST;
        props.editDialogRef.current.openWithParentId(parentId, addedSectionType);
    }

    return (
        <React.Fragment>
            {(sections && sections.length > 0) && sections.map(section => (
                <Accordion sx={{backgroundColor: `${colorPalette[sections[0].sectionType]}`}} key={section.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls={section.id}
                        id={section.id}
                        sx={{
                            borderBottom: "1px solid rgba(0, 0, 0, .125)",
                            alignItems: "center",
                            '& .MuiAccordionSummary-content': {
                                alignItems: "center",
                                columnGap: 1
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
                            {!props.editDisabled && <ButtonGroup
                                variant="plain"
                                sx={{
                                    marginRight: "5px",
                                    "--ButtonGroup-separatorColor": "rgba(0,0,0,0) !important"
                                }}
                            >
                                <IconButton onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSection(section.id, section.sectionType);
                                }}>
                                    <AddRounded sx={{color: grey[500]}}/>
                                </IconButton>
                                <SectionMenu
                                    section={section}
                                    handleEdit={() => props.handleEdit(section)}
                                    handleDelete={() => props.handleDelete(section)}
                                />
                            </ButtonGroup>}
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
                                            handleEdit={() => props.handleEdit(nest)}
                                            handleDelete={() => props.handleDelete(nest)}/>
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
                                            onClick={() => handleAddSection(section.id, section.sectionType)}
                                        >
                                            <AddRounded sx={{color: grey[500], fontSize: 80}}/>
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                            :
                            <React.Fragment>
                                <DovecoteAccordion
                                    sections={section.children}
                                    editDialogRef={props.editDialogRef}
                                    updateSections={props.updateSections}
                                    handleEdit={props.handleEdit}
                                    handleDelete={props.handleDelete}
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
        </React.Fragment>
    );
};

export default DovecoteAccordion;