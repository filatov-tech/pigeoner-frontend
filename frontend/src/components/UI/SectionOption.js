import React from 'react';

class SectionOption extends React.Component {
    static defaultProps = {
        prefixElement: '\xa0\xa0\u23B9\xa0\xa0\xa0'
    }

    render() {
        const section = this.props.section;
        const currentLevelPrefix = this.props.hierarchyLevel;
        if (section.children.length > 0) {
            const nextLevelPrefix = currentLevelPrefix + SectionOption.defaultProps.prefixElement;
            return <React.Fragment>
                <option value={section.id}>{currentLevelPrefix}   {section.name}</option>
                {section.children.map(section =>(
                    <SectionOption section={section} hierarchyLevel={nextLevelPrefix}/>
                ))}
            </React.Fragment>;
        } else {
            return <option value={section.id}>{currentLevelPrefix}   {section.name}</option>;
        }
    }
}

export default SectionOption;