import React, {useEffect, useState} from 'react';
import {getMappedPigeonData, gridElements, relativeNamesMap} from '../../../util/pedigree-builder';
import PigeonCard from "./PigeonCard";
import EmptyCard from "./EmptyCard";
import {useMediaQuery} from "react-responsive";
import {Stack} from "@mui/material";
import {Typography} from "@mui/joy";


const PedigreeTree = ({pigeon}) => {
    const md = useMediaQuery({ query: "(max-width: 1200px)" })
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
                        {md
                            ?
                            <Stack>
                                <Typography level="body-md" textAlign="center" fontWeight={300} mt={2} mb={1}>
                                    {relativeNamesMap.get(gridElement)}
                                </Typography>
                                {pigeonsGridMap.get(gridElement) && pigeonsGridMap.get(gridElement).id > 0
                                    ? <PigeonCard pigeon={pigeonsGridMap.get(gridElement)} />
                                    : <EmptyCard pigeonStub={pigeonsGridMap.get(gridElement)} />}
                            </Stack>
                            :
                            <>
                                {pigeonsGridMap.get(gridElement) && pigeonsGridMap.get(gridElement).id > 0
                                    ? <PigeonCard pigeon={pigeonsGridMap.get(gridElement)} />
                                    : <EmptyCard pigeonStub={pigeonsGridMap.get(gridElement)} />}
                            </>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedigreeTree;