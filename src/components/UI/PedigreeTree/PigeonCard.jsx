import React from 'react';
import Flight from "./Flight";


const PigeonCard = ({pigeon}) => {
    const flights = pigeon.flights ? pigeon.flights : null;
    const cardSize = pigeon.cardSize;

    return (
        <div className={"pigeon-card " + pigeon.sex}>
            <div className={`card no-border ${cardSize}`}>
                <div className={`card-header no-border ${pigeon.sex}-background`}>
                    <h5 className="mb-0">{pigeon.ringNumber} {pigeon.name && ` - ${pigeon.name}`}</h5>
                </div>
                <div className="card-body">
                    <p className="card-text">
                        {pigeon.year} - {pigeon.condition}
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