import React, {useEffect, useState} from 'react';
import {getMappedPigeonData, gridElements} from '../../../util/pedigree-builder';
import PigeonCard from "./PigeonCard";
import EmptyCard from "./EmptyCard";


const PedigreeTree = ({pigeon}) => {
    const [pigeonsGridMap, setPigeonsGridMap] = useState(new Map());
    useEffect(()=> {
        setPigeonsGridMap(getMappedPigeonData(pigeon))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="container genealogy-frame">
            <div className="pedigree-tree">
                {gridElements && gridElements.map(gridElement =>
                    <div className={gridElement} key={gridElement}>
                        {pigeonsGridMap.get(gridElement) && pigeonsGridMap.get(gridElement).id > 0
                            ? <PigeonCard pigeon={pigeonsGridMap.get(gridElement)} />
                            : <EmptyCard pigeonStub={pigeonsGridMap.get(gridElement)} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedigreeTree;