import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Button, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {DeleteForeverOutlined} from "@mui/icons-material";

const DeleteFlightResultDialog = (props, ref) => {
    const [candidateId, setCandidateId] = useState(null);

    const startDeletion = (flightResultId) => {
        props.setOpen(true);
        setCandidateId(flightResultId);
    }

    useImperativeHandle(ref, ()=> ({
        startDeletion
    }));

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={props.open}
            onClose={(e) => {
                e.stopPropagation();
                props.setOpen(false);
            }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <ModalDialog
                color="danger"
                layout="center"
                size="md"
                variant="outlined"
            >
                <ModalClose onClick={(e) => e.stopPropagation()} />
                <DialogTitle>Удаление участника</DialogTitle>
                <DialogContent>Данный участник будет удален из текущего вылета</DialogContent>
                <Stack direction="row-reverse" spacing={2}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleDelete(candidateId);
                            props.setOpen(false);
                        }}
                        startDecorator={<DeleteForeverOutlined />}
                        color="danger"
                        variant="solid"
                    >
                        Удалить
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setOpen(false);
                        }}
                        color="danger"
                        variant="outlined"
                    >
                        Отмена
                    </Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
};

export default forwardRef(DeleteFlightResultDialog);