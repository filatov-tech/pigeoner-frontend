import React from 'react';
import {BODY} from "../util/main-page-body";

const MainPage = () => {
    return (
        <div dangerouslySetInnerHTML={{__html: BODY}} />
    );
};

export default MainPage;