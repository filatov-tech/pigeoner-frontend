import React from 'react';
import SectionOption from "./SectionOption";

class SectionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            sections: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/v1/sections/hierarchy")
            .then(response => response.json())
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        sections: result
                    })
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    render() {
        const {error, isLoaded, sections} = this.state;
        let rootLevel = '';
        if (error) {
            return <div>Ошибка! {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <select id="location" className="form-select" name="location">
                    <option value={''}>Выберите голубятню</option>
                    {sections.map(section => (
                        <SectionOption section={section} hierarchyLevel={rootLevel} key={section.id}/>
                    ))}
                </select>
            );
        }
    }
}

export default SectionSelect;