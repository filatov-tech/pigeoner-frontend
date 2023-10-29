import React from 'react';
import {Dropdown, Tooltip} from "@mui/joy";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import {grey} from "@mui/material/colors";

const VacantLabelMenu = (props) => {
    return (
        <Dropdown>
            <MenuButton
                sx={{
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    color: grey[600],
                    backgroundColor: "#f4f4f5",
                    border: "none",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.3)",
                    borderRadius: "5px"
                }}
            >
                {props.children}
            </MenuButton>
            <Menu>
                <Tooltip variant="soft" title="Функция в разработке" color="warning">
                    <MenuItem>Добавить голубя</MenuItem>
                </Tooltip>
            </Menu>
        </Dropdown>
    );
};

export default VacantLabelMenu;