import React from 'react';
import {Tooltip} from "@mui/joy";

const PigeonLabel = ({pigeon}) => {
    const sex = {
        MALE: "male",
        FEMALE: "female"
    }
    
    return (
        <React.Fragment>
            {pigeon
                ? <div className={`label label-${sex[pigeon.sex]}`}>
                    {pigeon.name
                        ?
                        <Tooltip title={pigeon.ringNumber} variant="plain" arrow>
                            <span>{pigeon.name}</span>
                        </Tooltip>
                        :
                        pigeon.ringNumber}
                </div>
                : <div className={`label label-vacant`}>Cвободно</div>}
        </React.Fragment>
    );
};

export default PigeonLabel;