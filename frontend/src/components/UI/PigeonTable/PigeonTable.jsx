import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";

const PigeonTable = ({data}) => {
    const columns = useMemo(() => [
        {
            accessorKey: 'ringNumber',
            header: 'Кольцо'
        },
        {
            accessorKey: 'color',
            header: 'Окрас'
        },
        {
            accessorKey: 'sex',
            header: 'Пол',
            size: 100
        },
        {
            accessorKey: 'birthday',
            header: 'Дата рождения'
        },
        {
            accessorKey: 'age',
            header: 'Возраст'
        },
        {
            accessorKey: 'mate',
            header: 'Пара'
        },
        {
            accessorKey: 'status',
            header: 'Статус'
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
        muiTableBodyRowProps={({ row }) => ({
            onClick: (event) => {
                console.info(event, row.id);
            }
        })}
        localization={MRT_Localization_RU}
    />;
};

export default PigeonTable;