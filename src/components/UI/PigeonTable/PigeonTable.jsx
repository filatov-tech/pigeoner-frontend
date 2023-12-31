import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import {Tooltip} from "@mui/joy";
import Box from "@mui/material/Box";
import {Condition, Sex} from "../../../constants";
import {Female, Male} from "@mui/icons-material";
import {getCountryNameRu} from "../../../util/country-codes";

const PigeonTable = ({data, isLoading}) => {
    const addLinkToCell = function () {
        return (({ cell,row }) => {
            return <>
                {cell.getValue()}
                <Link to={`/pigeons/${row.original.id}`} className="table-link"></Link>
            </>;
        });
    }

    function addLinkToCellWithTooltip(row, cell, title) {
        return <Tooltip title={title} placement="left" variant="outlined" arrow>
            <Box>
                {cell.getValue()}
                <Link to={`/pigeons/${row.original.id}`} className="table-link"></Link>
            </Box>
        </Tooltip>;
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Кличка',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'ringNumber',
            header: 'Кольцо',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'year',
            header: 'Год',
            Cell: ({cell, row}) => {
                const birthdate = row.original.birthdate;
                return birthdate
                    ? addLinkToCellWithTooltip(row, cell, birthdate)
                    : addLinkToCell();
            }
        },
        {
            accessorKey: 'countryCode',
            header: 'Страна',
            Cell: ({cell, row}) => addLinkToCellWithTooltip(row, cell, getCountryNameRu(row.original.countryCode))

        },
        {
            accessorKey: 'sex',
            header: 'Пол',
            size: 100,
            Cell: ({cell, row}) => {
                const pigeonSex = Sex[cell.getValue()];
                return <>
                    <Tooltip title={pigeonSex} placement="left" variant="outlined" arrow>
                        <Box>
                            {pigeonSex === Sex.MALE ? <Male sx={{color: "#2249ff"}} /> : <Female sx={{color: "#ff229f"}} />}
                            <Link to={`/pigeons/${row.original.id}`} className="table-link"></Link>
                        </Box>
                    </Tooltip>
                </>;
            }
        },
        {
            accessorKey: 'section.rootName',
            header: 'Голубятня',
            Cell: ({cell, row}) => {
                const fullAddress = row.original.section ? row.original.section.fullAddress : null;
                if (fullAddress) {
                    return addLinkToCellWithTooltip(row, cell, fullAddress);
                } else {
                    return addLinkToCell();
                }
            }
        },
        {
            accessorKey: 'mateRingNumber',
            header: 'Пара',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'condition',
            header: 'Состояние',
            Cell: ({cell, row}) => {
                return <>
                    {Condition[cell.getValue()]}
                    <Link to={`/pigeons/${row.original.id}`} className="table-link"></Link>
                </>;
            }
        },
        {
            accessorKey: 'color',
            header: 'Окрас',
            Cell: addLinkToCell()
        },
        ],
        []
    );

    return <MaterialReactTable
        columns={columns}
        data={data || []}
        state={{isLoading: isLoading}}
        muiTablePaperProps={{
            sx: {
                borderRadius: '0.5rem',
            },
        }}
        muiTableBodyCellProps={{
            sx: {
                position: "relative"
            }
        }}
        localization={MRT_Localization_RU}
        initialState={{
            density: "compact",
            pagination: {
                pageSize: 50
            }
        }}
    />;
};

export default PigeonTable;