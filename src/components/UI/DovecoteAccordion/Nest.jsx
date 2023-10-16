import React from 'react';
import PigeonLabel from "./PigeonLabel";
import Grid from "@mui/material/Unstable_Grid2";
import {Stack, Typography} from "@mui/material";
import SectionMenu from "../SectionMenu";
import {grey} from "@mui/material/colors";

const Nest = ({data, handleEdit, handleDelete}) => {
    return (
        <div className="card">
            {data && <React.Fragment>
                <div className="card-header" style={{backgroundColor: "rgba(247,251,255,0.5)"}}>
                    {/*<h5 className="mb-0" style={{textAlign: "center"}}>{data.name}</h5>*/}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            variant="body1"
                            color={grey[800]}
                            sx={{textAlign: "center", flex: "1 1 auto"}}
                        >
                            {data.name}
                        </Typography>
                        <SectionMenu section={data} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </Stack>
                </div>
                <div className="card-body">
                    <Grid container spacing={1}>
                        <Grid xs={12}>
                            <PigeonLabel pigeon={data.pigeons[0]} />
                        </Grid>
                        <Grid xs={12}>
                            <PigeonLabel pigeon={data.pigeons[1]} />
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
            }
        </div>
    );
};

export default Nest;