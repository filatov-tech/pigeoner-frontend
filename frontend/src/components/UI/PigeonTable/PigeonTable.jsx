import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";

const PigeonTable = ({data}) => {
    const addLinkToCell = function () {
        return (({ cell,row }) => {
            return <>{cell.getValue()}<Link to={`/pigeons/${row.original.id}`} className="table-link"></Link></>;
        });
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'ringNumber',
            header: 'Кольцо',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'color',
            header: 'Окрас',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'sex',
            header: 'Пол',
            size: 100,
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'birthday',
            header: 'Дата рождения',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'age',
            header: 'Возраст',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'mate',
            header: 'Пара',
            Cell: addLinkToCell()
        },
        {
            accessorKey: 'status',
            header: 'Статус',
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