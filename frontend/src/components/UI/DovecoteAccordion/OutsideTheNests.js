import React from 'react';
import PigeonLabel from "./PigeonLabel";

class OutsideTheNests extends React.Component {
    render() {
        const pigeons = this.props.pigeons;
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Голуби вне гнёзд</h5>
                    </div>
                    <div className="card-body">
                        {pigeons.length > 0
                            ?
                            <div className="row">
                                {pigeons.map(pigeon => (
                                    <PigeonLabel pigeon={pigeon} isOutside={true} key={pigeon.id}/>
                                ))}
                                <PigeonLabel isOutside={true} />
                            </div>
                            :
                            <div>
                                Нет голубей <strong>вне</strong> гнёзд
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default OutsideTheNests;
