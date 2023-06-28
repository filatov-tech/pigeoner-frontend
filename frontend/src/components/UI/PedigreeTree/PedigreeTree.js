import React from "react";
import "../../../styles/custom-styles.css";
import EmptyCard from "./EmptyCard";

const gridElements = [
    "pigeon",
    "father", "mother",
    "ff", "fm", "mf", "mm",
    "fff", "ffm", "fmf", "fmm", "mff", "mfm", "mmf", "mmm"
]

let currentQueue = new Queue();
let nextQueue = new Queue();
let pigeonsMap = new Map();
let deepMeter;

function PigeonEmptyStub() {
    this.id = 0;
    this.father = null;
    this.mother = null
}

class PedigreeTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            pigeon: null
        }
    }

    componentDidMount() {
        const pigeonId = 100017;
        fetch(`http://localhost:8080/api/v1/pigeons/${pigeonId}/with-ancestors`)
            .then(response => response.json())
            .then(
                pigeon => {
                    mapPigeonData(pigeon);
                    this.setState({
                        isLoaded: true,
                        pigeon: pigeon
                    })
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            );
    }

    render() {
        const {error, isLoaded} = this.state;
        if (error) {
            return <div>Ошибка! {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="spinner-border text-primary m-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            );
        } else {
            return (
                <div className="container genealogy-frame">
                    <div className="pedigree-tree">
                        {gridElements.map(gridElement =>
                            <div className={gridElement} key={gridElement}>
                                {pigeonsMap.get(gridElement).id > 0
                                    ? <PigeonCard pigeon={pigeonsMap.get(gridElement)} />
                                    : <EmptyCard pigeonStub={pigeonsMap.get(gridElement)} />}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }
}

class PigeonCard extends React.Component {
    render() {
        const pigeon = this.props.pigeon;
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
                            {pigeon.year} - {pigeon.status} - {pigeon.isNative
                            ? <span className="text-success">{pigeon.keeper}</span>
                            : <span className="text-danger">{pigeon.keeper}</span>
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
                                    <br/>
                                    <strong>Заметки:</strong><br/>
                                    {pigeon.note ? pigeon.note : "Заметок нет"}
                                </React.Fragment>
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

class Flight extends React.Component {
    render() {
        const flight = this.props.flight;
        return (
            `- ${flight.distance} ${flight.location}: ${flight.position}/${flight.totalParticipants}`
        );
    }
}

function mapPigeonData(pigeon) {
    deepMeter = 0;
    currentQueue.enqueue(pigeon);
    for (const gridElement of gridElements) {
        let processedPigeon = currentQueue.dequeue();
        processedPigeon.cardSize = resolveCardSize(deepMeter);
        pigeonsMap.set(gridElement, processedPigeon);
        updateQueuesAndDeepLevel(processedPigeon);
    }
}

function resolveCardSize(deepLevel) {
    let size;
    switch (deepLevel) {
        case 0:
        case 1:
            size = "card-big";
            break;
        case 2:
            size = "card-medium";
            break;
        case 3:
        default:
            size = "card-small";
            break;
    }
    return size;
}

function updateQueuesAndDeepLevel(pigeon) {
    const isLevelEnd = currentQueue.size() === 0;
    const queue = isLevelEnd ? currentQueue : nextQueue;
    if (isLevelEnd) {
        deepMeter++;
        while(nextQueue.size() > 0) {
            currentQueue.enqueue(nextQueue.dequeue());
        }
    }
    queue.enqueue(pigeon.father === null ? createStub(pigeon) : pigeon.father);
    queue.enqueue(pigeon.mother === null ? createStub(pigeon) : pigeon.mother);
}

function createStub(pigeon) {
    let pigeonStub = new PigeonEmptyStub();
    pigeonStub.parentId = pigeon.id;
    return pigeonStub;
}

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {
    let oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

export default PedigreeTree;
// const root = ReactDOM.createRoot(document.getElementById('genealogy-view'));
// root.render(<PedigreeTree/>);