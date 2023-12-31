import {Queue} from "./queue";

export const gridElements = [
    "pigeon",
    "father", "mother",
    "ff", "fm", "mf", "mm",
    "fff", "ffm", "fmf", "fmm", "mff", "mfm", "mmf", "mmm"
]

const relativeNamesValues = {
    pigeon: "Голубь",
    father: "Отец",
    mother: "Мать",
    ff: "Отец > Дед",
    fm: "Отец > Бабка",
    mf: "Мать > Дед",
    mm: "Мать > Бабка",
    fff: "Отец > Дед > Прадед",
    ffm: "Отец > Дед > Прабабка",
    fmf: "Отец > Бабка > Прадед",
    fmm: "Отец > Бабка > Прабабка",
    mff: "Мать > Дед > Прадед",
    mfm: "Мать > Дед > Прабабка",
    mmf: "Мать > Бабка > Прадед",
    mmm: "Мать > Бабка > Прабабка"
}

export const relativeNamesMap = new Map(Object.entries(relativeNamesValues));


let currentQueue;
let nextQueue;
let deepMeter;

function PigeonEmptyStub() {
    this.id = 0;
    this.father = null;
    this.mother = null
}

export function getMappedPigeonData(pigeon) {
    let pigeonsMap = new Map();
    currentQueue = new Queue();
    nextQueue = new Queue();
    deepMeter = 0;

    currentQueue.enqueue(pigeon);
    for (const gridElement of gridElements) {
        let processedPigeon = currentQueue.dequeue();
        processedPigeon.cardSize = resolveCardSize(deepMeter);
        pigeonsMap.set(gridElement, processedPigeon);
        updateQueuesAndDeepLevel(processedPigeon);
    }
    return pigeonsMap;
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
    pigeonStub.childId = pigeon.id;
    return pigeonStub;
}