import React from 'react';
import Nest from "./Nest";
import OutsideTheNests from "./OutsideTheNests";

class DovecoteAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            parentId: 1,
            sections: []
        }
    }

    componentDidMount() {
        if (this.props.sections) {
            this.setState({
                isLoaded: true,
                parentId: this.props.parentId,
                sections: this.props.sections
            });
        } else {
            this.initComponent();
        }
    }

    initComponent() {
        fetch('http://localhost:8080/api/v1/sections/hierarchical-with-pigeons')
            .then(resp => resp.json())
            .then(
                result => {
                    this.setState(() => {
                        return {
                            isLoaded: true,
                            sections: result
                        }
                    });
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
        const {error, isLoaded, sections, parentId} = this.state;
        if (error) {
            return <div>Ошибка! {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="spinner-border text-primary m-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            );
        } else {
            const dataBsTarget = `#accordion-${parentId} .item-`;
            const ariaControls = `accordion-${parentId} .item-`;
            return (
                <div className="accordion" id={"accordion-" + parentId} role="tablist">
                    {sections.map(section => (
                            <div className="accordion-item" key={section.id}>
                                <h2 className="accordion-header" role="tab">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target={dataBsTarget + section.id} aria-expanded="false"
                                            aria-controls={ariaControls + section.id}>
                                        {section.name}: {section.pigeonsNumber} гол.
                                    </button>
                                </h2>
                                <div className={"accordion-collapse collapse item-" + section.id} id={"item-" + section.id} role="tabpanel">
                                    <div className="accordion-body">
                                        {(section.children.length > 0 && section.children[0].sectionType === "NEST")
                                            ?
                                            <div className="row g-1 g-sm-2">
                                                {section.children.map(nest => (
                                                    <div className="col-6 col-md-3 col-lg-2 text-center" key={nest.id}>
                                                        <Nest pigeons={nest.pigeons} name={nest.name}/>
                                                    </div>
                                                ))}
                                                <OutsideTheNests pigeons={section.pigeons} />
                                            </div>
                                            :
                                            (<React.Fragment>
                                                <strong>Секции:</strong>
                                                <DovecoteAccordion sections={section.children} parentId={section.id}/>
                                            </React.Fragment>)}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            );
        }
    }
}

export default DovecoteAccordion;