import React from 'react';
import {useParams} from "react-router-dom";

const Pigeon = () => {
    let { id } = useParams()

    return (
        <div>
            <h1>Pigeon with id={id}</h1>
        </div>
    );
};

export default Pigeon;