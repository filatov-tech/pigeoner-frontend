import React from 'react';

class PigeonLabel extends React.Component {
    render() {
        const pigeon = this.props.pigeon;
        const col = this.props.isOutside ? "col-6 col-md-2" : "col-12";
        return (
            <React.Fragment>
                {pigeon
                    ? <div className={`m-2 ${col} label label-${pigeon.sex}`}>{pigeon.ringNumber}</div>
                    : <div className={`m-2 ${col} label label-vacant`}>Cвободно</div>}
            </React.Fragment>
        );
    }
}

export default PigeonLabel;
