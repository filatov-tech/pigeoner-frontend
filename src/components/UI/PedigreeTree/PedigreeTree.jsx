import React, {useEffect, useState} from 'react';
import {getMappedPigeonData, gridElements, relativeNamesMap} from '../../../util/pedigree-builder';
import PigeonCard from "./PigeonCard";
import EmptyCard from "./EmptyCard";
import {useMediaQuery} from "react-responsive";
import {Stack} from "@mui/material";
import {Typography} from "@mui/joy";
import {AUTH_TOKEN, BEARER, PIGEONS_URL} from "../../../constants";


const PedigreeTree = ({pigeon, reloadPedigree}) => {
    const md = useMediaQuery({ query: "(max-width: 1200px)" })
    const [pigeonsGridMap, setPigeonsGridMap] = useState(new Map());

    const [pigeons, setPigeons] = useState();

    const fetchPigeons = async () => {
        try {
            const response = await fetch(PIGEONS_URL, {
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            });
            if (response.ok) {
                const pigeons = await response.json();
                setPigeons(pigeons);
            }
        } catch (e) {
            throw new Error("Ошибка при попытке загрузить голубей", e);
        }
    }


    useEffect(()=> {
        setPigeonsGridMap(getMappedPigeonData(pigeon));
        fetchPigeons();
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
                                    : <EmptyCard
                                        pigeonStub={pigeonsGridMap.get(gridElement)}
                                        pigeons={pigeons}
                                        reloadPedigree={reloadPedigree}
                                    />}
                            </Stack>
                            :
                            <>
                                {pigeonsGridMap.get(gridElement) && pigeonsGridMap.get(gridElement).id > 0
                                    ? <PigeonCard pigeon={pigeonsGridMap.get(gridElement)} />
                                    : <EmptyCard
                                        pigeonStub={pigeonsGridMap.get(gridElement)}
                                        pigeons={pigeons}
                                        reloadPedigree={reloadPedigree}
                                    />}
                            </>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedigreeTree;