import React, {useState} from 'react';
import {Button, DialogTitle, Modal, ModalDialog} from "@mui/joy";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {getHelperText} from "../../../../util/utils";

const SimpleSectionChooseDialog = ({open, setOpen, error, setError, handleMove, sectionsOptions}) => {
    const [sectionId, setSectionId] = useState();
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
                <DialogTitle>Переместить голубя в:</DialogTitle>
                <form>
                    <Stack spacing={2}>
                        <FormControl variant="outlined" error={error}>
                            <InputLabel id="dovecote">Секция</InputLabel>
                            <Select
                                id="dovecote"
                                value={sectionId}
                                label="Секция"
                                onChange={(event) => {
                                    setError(null);
                                    setSectionId(event.target.value);
                                }}
                                renderValue={(value) => sectionsOptions.find(section => section.id === value).name}
                            >
                                <MenuItem dense value={null}>-</MenuItem>
                                {sectionsOptions && sectionsOptions.map(section =>
                                    <MenuItem dense value={section.id} key={section.id}>{section.label}</MenuItem>
                                )}
                            </Select>
                            <FormHelperText>{getHelperText(error)}</FormHelperText>
                        </FormControl>
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
                                onClick={() => handleMove(sectionId)}
                                sx={{backgroundColor: "#337ab7"}}
                                size="lg"
                            >
                                Переместить
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default SimpleSectionChooseDialog;