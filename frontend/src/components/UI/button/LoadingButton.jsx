import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";

const LoadingButton = ({name}) => {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        function simulateNetworkRequest() {
            return new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (isLoading) {
            simulateNetworkRequest().then(() => {
                setLoading(false);
            })
        }
    }, [isLoading]);

    const  handleClick = () => setLoading(true);

    return (
        <Button
            variant="outline-secondary"
            size="lg"
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
        >
            {isLoading ? 'Загрузка…' : `${name}`}
        </Button>
    );
};

export default LoadingButton;