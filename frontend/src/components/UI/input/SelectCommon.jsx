import React, {useId} from 'react';

const SelectCommon = ({filterData}) => {
    const selectId = useId();

    return (
        <>
            {filterData.label && <label className="form-label" htmlFor={selectId}>
                <strong>{filterData.label}</strong>
            </label>}
            <select id={selectId} className="form-select" name={filterData.name}>
                <option value="">{filterData.placeholder}</option>
                {filterData.options.map(option =>
                    <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
        </>
    );
};

export default SelectCommon;