export function flatten(hierarchicalObjects) {
    if (hierarchicalObjects && hierarchicalObjects.length === 0) return [];

    let resultArray = [];

    hierarchicalObjects.forEach(element => {
        pushRecursively(element, resultArray);
    })

    return resultArray;
}

function pushRecursively(hierarchicalObject, array) {
    array.push(hierarchicalObject);
    if (hierarchicalObject.children.length === 0) return;
    hierarchicalObject.children.forEach(child => {
        pushRecursively(child, array);
    })
}