import React from 'react';
import {Typography} from "@mui/joy";
import {useMediaQuery} from "react-responsive";


const InfoUnitTitle = (props) => {
    const isLg = useMediaQuery({query: "(min-width: 1200px)"});
    return (
        <Typography level="body-lg" sx={{flex: "0 1 auto", textAlign: "right", minWidth: isLg ? "0" : "95px"}}>
            {props.children}
        </Typography>
    );
};

export default InfoUnitTitle;