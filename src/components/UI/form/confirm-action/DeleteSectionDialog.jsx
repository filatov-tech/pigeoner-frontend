import React from 'react';
import {Button, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {DeleteForeverOutlined} from "@mui/icons-material";

const DeleteSectionDialog = (props) => {

    const text = {
        NEST: "Вы пытаетесь удалить гнездо. Все голуби останутся в текущей секции, в разделе \"Вне гнезд\"",
        ROOM: "Вы пытаетесь удалить секцию. Это приведет к удалению всех вложенных секций и гнезд. Все голуби переместяться в раздел \"Прочие голуби\"",
        DOVECOTE: "Внимание! Удаление голубятни приведет к удалению всех вложенных секций и гнезд. Все голуби переместяться в раздел \"Прочие голуби\""
    };
    const title = {
        NEST: "гнезда",
        ROOM: "секции",
        DOVECOTE: "голубятни"
    }

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
                <DialogTitle>Удаление {title[props.section.sectionType]}</DialogTitle>
                <DialogContent>{text[props.section.sectionType]}</DialogContent>
                <Stack direction="row-reverse" spacing={2}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleDelete();
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

export default DeleteSectionDialog;