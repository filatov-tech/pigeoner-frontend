import React, {useCallback, useRef, useState} from 'react';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import DeleteSectionDialog from "./form/confirm-action/DeleteSectionDialog";
import {grey} from "@mui/material/colors";

const SectionMenu = ({section, handleEdit, handleDelete}) => {
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const startEdit = () => {
        setOpen(false);
        handleEdit(section);
    }

    const handleOpenChange = useCallback((event, isOpen) => {
        setOpen(isOpen);
    }, []);

    return (
        <React.Fragment>
            <Dropdown open={open} onOpenChange={handleOpenChange}>
                <MenuButton
                    slots={{root: IconButton}}
                    slotProps={{root: {color: 'neutral'}}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Edit sx={{color: grey[400], fontSize: 20}}/>
                </MenuButton>
                <Menu placement="bottom-end">
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        startEdit();
                    }}>
                        <ListItemDecorator>
                            <Edit/>
                        </ListItemDecorator>{' '}
                        Изменить
                    </MenuItem>
                    <ListDivider/>
                    <MenuItem variant="soft" color="danger" onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogOpen(true);
                    }}>
                        <ListItemDecorator sx={{color: 'inherit'}}>
                            <DeleteForever/>
                        </ListItemDecorator>{' '}
                        Удалить
                    </MenuItem>
                </Menu>
            </Dropdown>
            <DeleteSectionDialog
                section={section}
                handleDelete={handleDelete}
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
            />
        </React.Fragment>

    );
};

export default SectionMenu;