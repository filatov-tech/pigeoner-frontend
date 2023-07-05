import {React, useMemo} from 'react';
import {MaterialReactTable} from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";

const FlightTable = ({data}) => {
    const columns = useMemo(() => [
            {
                accessorKey: 'position',
                header: 'Поз.'
            },
            {
                accessorKey: 'ringNumber',
                header: 'Номер кольца'
            },
            {
                accessorKey: 'arrivalTime',
                header: 'Время прилета'
            },
            {
                accessorKey: 'isPassed',
                header: 'В зачете'
            },
            {
                accessorKey: 'winPoints',
                header: 'Балл'
            },
            {
                accessorKey: 'averageSpeed',
                header: 'Скорость'
            },
            {
                accessorKey: 'afterFlightCondition',
                header: 'Состояние'
            },
            {
                accessorKey: 'keeper',
                header: 'Тренер'
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