import React from 'react';
import PigeonToPedigreeAddButton from "../button/PigeonToPedigreeAddButton";

const EmptyCard = ({pigeonStub, pigeons, reloadPedigree}) => {
    return (
        <>{pigeonStub && <div className="pigeon-card card-empty">
            <div className={`card no-border ${pigeonStub.cardSize} d-flex`} style={{height: 100 + "%"}}>
                <div className={`card-header no-border`}>
                    <h5 className="mb-0">Пустой слот</h5>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                    {pigeonStub.childId > 0 &&
                        <PigeonToPedigreeAddButton
                            childId={pigeonStub.childId}
                            pigeons={pigeons}
                            reloadPedigree={reloadPedigree}
                        />
                    }
                </div>
            </div>
        </div>}
        </>
    );
};

export default EmptyCard;