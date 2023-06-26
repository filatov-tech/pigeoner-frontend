import React from 'react';
import PigeonLabel from "./PigeonLabel";

class Nest extends React.Component {
    render() {
        const pigeons = this.props.pigeons;
        const name = this.props.name;
        return (

            <div className="card nest">
                <div className="card-header">
                    <h5 className="mb-0">{name}</h5>
                </div>
                <div className="card-body">
                    <div className="row g-2">
                        <PigeonLabel pigeon={pigeons[0]} />
                        <PigeonLabel pigeon={pigeons[1]} />
                    </div>
                </div>
            </div>

        )
    }
}

export default Nest;