import React, {useId} from 'react';

const InputText = ({filterData}) => {
    const textInputId = useId();

    return (
        <>
            <label className="form-label" htmlFor={textInputId}>
                <strong>{filterData.label}</strong>
            </label>
            <input
                id={textInputId} className="form-control" type="text" placeholder={filterData.placeholder}
                name={filterData.name}/>
        </>
    );
};

export default InputText;
