import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";

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
                    addLinkToCell;
            }
        },
        {
            accessorKey: 'sex',
            header: 'Пол',
            size: 100,
            Cell: addLinkToCell()
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