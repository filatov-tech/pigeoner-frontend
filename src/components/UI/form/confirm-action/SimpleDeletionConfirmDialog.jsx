import React from 'react';
import {Button, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {DeleteForeverOutlined} from "@mui/icons-material";

const SimpleDeletionConfirmDialog = ({open, setOpen, handleDelete, title, content}) => {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={(e) => {
                e.stopPropagation();
                setOpen(false);
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
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>{content}</DialogContent>
                <Stack direction="row-reverse" spacing={2}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                            setOpen(false);
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
                            setOpen(false);
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

export default SimpleDeletionConfirmDialog;