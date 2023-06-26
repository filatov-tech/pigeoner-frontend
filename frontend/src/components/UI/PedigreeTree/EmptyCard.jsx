import React from 'react';
import AddButton from "../button/AddButton";

const EmptyCard = ({pigeonStub}) => {
    return (
        <div className="pigeon-card card-empty">
            <div className={`card no-border ${pigeonStub.cardSize}`}>
                <div className={`card-header no-border`}>
                    <h5 className="mb-0">Пустой слот</h5>
                </div>
                <div className="card-body" style={{paddingLeft: 25 + "%"}}>
                    {pigeonStub.parentId > 0 && <AddButton />}
                </div>
            </div>
        </div>
    );
};

export default EmptyCard;