import React from 'react';
import AddButton from "../button/AddButton";

const EmptyCard = ({pigeonStub}) => {
    return (
        <div className="pigeon-card card-empty">
            <div className={`card no-border ${pigeonStub.cardSize} d-flex`} style={{height: 100 + "%"}}>
                <div className={`card-header no-border`}>
                    <h5 className="mb-0">Пустой слот</h5>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                    {pigeonStub.parentId > 0 && <AddButton />}
                </div>
            </div>
        </div>
    );
};

export default EmptyCard;