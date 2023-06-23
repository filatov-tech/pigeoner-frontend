import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";

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
            header: 'Пол'
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
    }}/>;
};

export default PigeonTable;