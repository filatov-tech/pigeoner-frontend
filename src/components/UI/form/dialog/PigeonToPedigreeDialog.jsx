import React, {useEffect, useState} from 'react';
import {Button, DialogTitle, Modal, ModalDialog} from "@mui/joy";
import {InputFieldData} from "../../PigeonTable/PigeonFilterForm";
import InputPigeonAutocomplete from "../../input/Autocomplete/InputPigeonAutocomplete";
import {AUTH_TOKEN, BEARER, PIGEONS_URL} from "../../../../constants";
import ErrorSnackbar from "../../ErrorSnackbar";
import {Stack} from "@mui/material";

const PigeonToPedigreeDialog = ({open, setOpen, childId, pigeons, reloadPedigree}) => {
    const [pigeonToAdd, setPigeonToAdd] = useState();
    const [error, setError] = useState();
    const [errorPigeonToAdd, setErrorPigeonToAdd] = useState();
    
    const pigeonToAddData = new InputFieldData("pigeonToAdd", pigeonToAdd, "Голубь", "", pigeons);

    const handleSubmit = async () => {
        const child = pigeons.find(pigeon => pigeon.id === childId);

        if (!pigeonToAdd.sex) {
            setErrorPigeonToAdd({message: "У добавляемого голубя должен быть определен пол"});
            return;
        }

        if (pigeonToAdd.sex === "MALE") {
            child.fatherId = pigeonToAdd.id;
        } else {
            child.motherId = pigeonToAdd.id;
        }

        try {
            const response = await fetch(PIGEONS_URL + `/${childId}`, {
                method: "PUT",
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(child)
            });
            if (response.ok) {
                setError(null);
                setErrorPigeonToAdd(null);
                reloadPedigree();
                setOpen(false);
            } else {
                const apiError = await response.json();
                setError(apiError);
                if (apiError.fields) {
                    setErrorPigeonToAdd(
                        apiError.fields.mother ||
                        apiError.fields.father ||
                        apiError.fields.birthdate
                    );
                }
            }
        } catch (e) {
            throw new Error(
                "Ошибка при попытке сохранить нового родителя для голубя с номером кольца - " + pigeonToAdd.ringNumber,
                e
            );
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <>
            {pigeons &&
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog>
                        <DialogTitle>Добавить голубя к родословной</DialogTitle>
                        <form>
                            <Stack spacing={2}>
                                <InputPigeonAutocomplete
                                    data={pigeonToAddData}
                                    onChange={setPigeonToAdd}
                                    error={errorPigeonToAdd}
                                    setError={setErrorPigeonToAdd}
                                />
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        variant="soft"
                                        onClick={() => setOpen(false)}
                                        size="lg"
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="solid"
                                        onClick={() => handleSubmit()}
                                        sx={{backgroundColor: "#337ab7"}}
                                        size="lg"
                                    >
                                        Сохранить
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </ModalDialog>
                </Modal>
            }
            {error && <ErrorSnackbar message={error.message} /> }
        </>
    );
};

export default PigeonToPedigreeDialog;