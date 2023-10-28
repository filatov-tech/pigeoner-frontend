import React from 'react';
import Flight from "./Flight";
import {Condition} from "../../../constants";
import {Stack} from "@mui/material";
import {Dropdown, Typography} from "@mui/joy";
import MenuButton from "@mui/joy/MenuButton";
import {MoreVert} from "@mui/icons-material";
import IconButton from "@mui/joy/IconButton";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import {useNavigate} from "react-router-dom";


const PigeonCard = ({pigeon, remove}) => {
    const navigate = useNavigate();

    const flights = pigeon.flights ? pigeon.flights : null;
    const cardSize = pigeon.cardSize;

    return (
        <div className={"pigeon-card " + pigeon.sex}>
            <div className={`card no-border ${cardSize}`}>
                <div className={`card-header no-border ${pigeon.sex}-background`} style={{paddingRight: "4px"}}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                        <Typography level="h4">{pigeon.ringNumber} {pigeon.name && ` - ${pigeon.name}`}</Typography>
                        <Dropdown>
                            <MenuButton
                                slots={{ root: IconButton }}
                                slotProps={{ root: { variant: 'plain'} }}
                            >
                                <MoreVert sx={{color: "rgba(0,0,0,0.5)"}}/>
                            </MenuButton>
                            <Menu>
                                <MenuItem onClick={() => navigate(`/pigeons/${pigeon.id}`)}>Перейти к голубю</MenuItem>
                                <MenuItem onClick={() => remove(pigeon)}>Удалить из родословной</MenuItem>
                            </Menu>
                        </Dropdown>
                    </Stack>
                </div>
                <div className="card-body">
                    <p className="card-text">
                        {pigeon.year} - {Condition[pigeon.condition]}
                        <br/>
                        <span>Владелец: </span>
                        {pigeon.isOwn
                        ? <span className="text-success">{pigeon.keeperName}</span>
                        : <span className="text-danger">{pigeon.keeperName}</span>
                    }
                        <br/>
                        {cardSize !== "card-small" &&
                            <React.Fragment>
                                <strong>Последние зачеты:</strong>
                                <br/>
                                {flights && flights[0] ? <Flight flight={flights[0]} /> : "- Зачетов нет"}
                                <br/>
                                {flights && flights[1] && <Flight flight={flights[1]} />}
                            </React.Fragment>
                        }
                        {cardSize === "card-big" &&
                            <React.Fragment>
                                <br/>
                                {flights && flights[2] && <Flight flight={flights[2]} />}
                                {pigeon.note && <><br/>
                                    <strong>Заметки:</strong>
                                    <br/>
                                    pigeon.note</>}
                            </React.Fragment>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PigeonCard;