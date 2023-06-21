import React, {useId} from 'react';
import '../../../styles/pigeons-filter.css';
import {Col, Row} from "react-bootstrap";

const SelectTwoFields = ({leftFilterData, rightFilterData}) => {
    const selectId = useId();

    return (
        <>
            <label className="col-form-label label-box" htmlFor={selectId}>
                <strong>{leftFilterData.label}</strong>
            </label>
            <Row>
                <Col>
                    <select id={selectId} className="form-select" name={leftFilterData.name}>
                        <option value>{leftFilterData.placeholder}</option>
                        {leftFilterData.options.map(option =>
                            <option value={option.value} key={option.label}>{option.label}</option>)}
                    </select>
                </Col>
                <Col>
                    <select className="form-select" name={rightFilterData.name}>
                        <option value>{rightFilterData.placeholder}</option>
                        {rightFilterData.options.map(option =>
                            <option value={option.value} key={option.label}>{option.label}</option>)}
                    </select>
                </Col>
            </Row>
        </>
    );
};

export default SelectTwoFields;