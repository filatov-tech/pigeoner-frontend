import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";

const FlightTable = ({data}) => {
    const columns = useMemo(() => [
            {
                accessorKey: 'locationName',
                header: 'Место выпуска'
            },
            {
                accessorKey: 'distance',
                header: 'Дистанция, км'
            },
            {
                accessorKey: 'numberParticipants',
                header: 'Мои голуби'
            },
            {
                accessorKey: 'myPassed',
                header: 'В зачете'
            },
            {
                accessorKey: 'totalParticipants',
                header: 'Всего участников'
            },
            {
                accessorKey: 'departure',
                header: 'Выпуск'
            }
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

export default FlightTable;