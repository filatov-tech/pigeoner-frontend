import React, {useContext, useState} from 'react';
import VacantLabelMenu from "../menu/VacantLabelMenu";
import PigeonLabelMenu from "../menu/PigeonLabelMenu";
import {flatten} from "../../../util/utils";
import {addHierarchicalLabelsTo} from "../../../util/section-options-builder";
import SimpleSectionChooseDialog from "../form/dialog/SimpleSectionChooseDialog";
import {AUTH_TOKEN, BEARER, PIGEONS_URL} from "../../../constants";
import AutocloseableErrorMessage from "../feedback-message/AutocloseableErrorMessage";
import {DovecoteContext} from "../../../pages/dovecote";

const PigeonLabel = ({pigeon}) => {

    const [openSectionDialog, setOpenSectionDialog] = useState(false);
    const [error, setError] = useState();
    const [sectionError, setSectionError] = useState();
    const {sections, fetchSections} = useContext(DovecoteContext);

    const sectionOptions = flatten(addHierarchicalLabelsTo(sections));


    const handleMove = async (movingSectionId) => {
        await updatePigeonWith(movingSectionId);
    }

    const handleRemove = async () => {
        const currentSection = sectionOptions.find(section => section.id === pigeon.sectionId);
        const parentSection = sectionOptions.find(section => currentSection.parentId === section.id);
        await updatePigeonWith(parentSection ? parentSection.id : -1);
    }

    const updatePigeonWith = async (newSectionId) => {
        try {
            const response = await fetch(PIGEONS_URL + `/${pigeon.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newSectionId)
            });
            if (response.ok) {
                setError(false);
                fetchSections();
                setOpenSectionDialog(false);
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields && apiError.fields.section) {
                    setSectionError(apiError.fields.section);
                }
            }
        } catch (e) {
            throw new Error("Ошибка при попытке переместить голубя из одной секции в другую");
        }
    }

    return (
        <React.Fragment>
            {pigeon
                ?
                <PigeonLabelMenu
                    isMale={pigeon.sex === "MALE"}
                    ringNumber={pigeon.ringNumber}
                    name={pigeon.name}
                    sectionOptions={sectionOptions}
                    handleMove={() => setOpenSectionDialog(true)}
                    handleRemove={() => handleRemove()}
                />
                :
                <VacantLabelMenu>
                    Cвободно
                </VacantLabelMenu>
            }
            <SimpleSectionChooseDialog
                open={openSectionDialog}
                setOpen={setOpenSectionDialog}
                error={sectionError}
                setError={setSectionError}
                handleMove={handleMove}
                sectionsOptions={sectionOptions}
            />
            {error && <AutocloseableErrorMessage error={error} setError={setError} timeout={3000}/>}
        </React.Fragment>
    );
};

export default PigeonLabel;