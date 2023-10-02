import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {Sex} from "../../../pages/pigeons";
import {Female, Male} from "@mui/icons-material";

const PigeonTable = ({data}) => {
    const addLinkToCell = function () {
        return (({ cell,row }) => {
            return <>{cell.getValue()}<Link to={`/pigeons/${row.original.id}`} className="table-link"></Link></>;
        });
    }

    function addLinkToCellWithTooltip(row, cell, title) {
        return <Tooltip title={title} placement="left" arrow>
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
                return birthdate ?
                    addLinkToCellWithTooltip(row, cell, birthdate) :
                    addLinkToCell();
            }
        },
        {
            accessorKey: 'sex',
            header: 'Пол',
            size: 100,
            Cell: ({cell, row}) => {
                const pigeonSex = Sex[cell.getValue()];
                return <>
                    <Tooltip title={Sex[cell.getValue()]} placement="left" variant="outlined" arrow>
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
            Cell: addLinkToCell()
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
        data={data}
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
    />;
};

export default PigeonTable;