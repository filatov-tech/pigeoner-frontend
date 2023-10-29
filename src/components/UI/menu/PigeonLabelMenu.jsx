import React from 'react';
import {Dropdown, Tooltip} from "@mui/joy";
import MenuButton from "@mui/joy/MenuButton";
import {grey} from "@mui/material/colors";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

const PigeonLabelMenu = ({isMale, name, ringNumber, handleMove, handleRemove}) => {
    return (
        <Dropdown>
            {name
                ?
                <Tooltip title={ringNumber} variant="plain" arrow placement="top">
                    <MenuButton
                        sx={{
                            width: "100%",
                            height: "100%",
                            padding: "10px",
                            color: grey[700],
                            backgroundColor: isMale ? "#d7ecff" : "#fae5f0",
                            border: "none",
                            textAlign: "center",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                            borderRadius: "5px"
                        }}
                    >
                        {name}
                    </MenuButton>
                </Tooltip>
                :
                <MenuButton
                    sx={{
                        width: "100%",
                        height: "100%",
                        padding: "10px",
                        color: grey[700],
                        backgroundColor: isMale ? "#d7ecff" : "#fae5f0",
                        border: "none",
                        textAlign: "center",
                        textDecoration: "none",
                        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                        borderRadius: "5px"
                    }}
                >
                    {ringNumber}
                </MenuButton>
            }
            <Menu>
                <MenuItem onClick={() => handleMove()}>Переместить голубя</MenuItem>
                <MenuItem onClick={() => handleRemove()}>Убрать голубя</MenuItem>
            </Menu>
        </Dropdown>
    );
};

export default PigeonLabelMenu;