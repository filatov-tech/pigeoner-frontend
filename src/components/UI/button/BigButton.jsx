import React from 'react';

const BigButton = ({name}) => {
    return (
        <button className="btn btn-primary btn-lg"
                type="button" style={{background: "rgb(51,122,183)"}}>
            {name}
        </button>
    );
};

export default BigButton;