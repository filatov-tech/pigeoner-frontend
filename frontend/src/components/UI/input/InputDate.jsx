import React, {useId} from 'react';

const InputDate = ({filterData}) => {
    const inputDateId = useId();

    return (
        <>
            <label className="form-label" htmlFor={inputDateId}>
                <strong>{filterData.label}</strong>
            </label>
            <input id={inputDateId} className="form-control" type="date" name={filterData.name}/>
        </>
    );
};

export default InputDate;