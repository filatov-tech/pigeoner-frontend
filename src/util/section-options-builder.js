const prefixElement = '\xa0\xa0\u23B9\xa0\xa0\xa0';

// This function only creates and returns an array of objects of type {value: int, label: string}.
// The data must be hierarchical. The label is formed from the name of each object, to which a prefix is added,
// the appearance of which depends on the nesting level.
export function makeHierarchicalViewOf(data) {
    if (data.length === 0) return [];

    const rootLevel = '';
    let optionsWithHierarchicalView = [];
    data.forEach(section => {
        addSectionOption(section, rootLevel, optionsWithHierarchicalView)
    })
    return optionsWithHierarchicalView;
}

function addSectionOption(hierarchicalObject, levelPrefix, sectionList) {
    sectionList.push({value: hierarchicalObject.id, label: `${levelPrefix} ${hierarchicalObject.name}`});

    if (hierarchicalObject.children.length === 0) return;

    const nextLevelPrefix = levelPrefix + prefixElement;
    hierarchicalObject.children.forEach(childSection => {
        addSectionOption(childSection, nextLevelPrefix, sectionList);
    })
}

export function addHierarchicalLabel(object, parentObject) {
    if (!parentObject) return object;

    object.prefix = parentObject.prefix + prefixElement;
    object.label = `${object.prefix} ${object.name}`
    return object;
}

export function addHierarchicalLabelsTo(data) {
    if (data.length === 0) return {};

    const rootLevel = '';
    data.forEach(section => {
        addLabelTo(section, rootLevel);
    })

    return data;
}

function addLabelTo(section, levelPrefix) {
    section.prefix = levelPrefix;
    section.label = `${levelPrefix}  ${section.name}`;

    if (section.children.length === 0) return;

    const nextLevelPrefix = levelPrefix + prefixElement;
    section.children.forEach(childSection => {
        addLabelTo(childSection, nextLevelPrefix);
    })
}
