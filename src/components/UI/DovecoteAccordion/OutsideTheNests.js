import React from 'react';
import Grid from "@mui/material/Unstable_Grid2"
import PigeonLabel from "./PigeonLabel";

class OutsideTheNests extends React.Component {
    render() {
        const pigeons = this.props.pigeons;
        return (
                <div className="card">
                    <div className="card-header" style={{backgroundColor: "rgba(247,251,255,0.5)"}}>
                        <h5 className="mb-0">Прочие голуби</h5>
                    </div>
                    <div className="card-body">
                        {pigeons.length > 0
                            ?
                            <Grid container spacing={2} columns={60}>
                                {pigeons.map(pigeon =>
                                    <Grid xs={30} sm={20} md={15} lg={12} key={pigeon.id}>
                                        <PigeonLabel pigeon={pigeon} key={pigeon.id} />
                                    </Grid>
                                )}
                                <Grid xs={30} sm={20} md={15} lg={12}>
                                    <PigeonLabel />
                                </Grid>
                            </Grid>
                            :
                            <div>
                                Нет голубей <strong>вне</strong> гнёзд
                            </div>
                        }
                    </div>
                </div>

        );
    }
}

export default OutsideTheNests;
