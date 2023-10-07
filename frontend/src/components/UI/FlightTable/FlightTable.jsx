import {React, useMemo} from 'react';
import {MaterialReactTable} from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {Tooltip} from "@mui/joy";

const FlightTable = ({data, official}) => {
    const columnsTraining = useMemo(() => [
            {
                accessorKey: 'position',
                header: 'Поз.'
            },
            {
                accessorKey: 'pigeonName',
                header: 'Кличка',
                size: 180
            },
            {
                accessorKey: 'ringNumber',
                header: 'Номер кольца',
                Cell: ({cell, row}) => {
                    return <Link to={`/pigeons/${row.original.pigeonId}`}>{cell.getValue()}</Link>;
                }
            },
            {
                accessorKey: 'arrivalTime',
                header: 'Время финиша',
                Cell: ({cell, row}) => {
                    const rawArrivalTime = dayjs.utc(cell.getValue()).local();
                    const time = rawArrivalTime.format("HH:mm:ss.SSS");
                    const date = rawArrivalTime.format("DD.MM.YYYY");
                    return <Tooltip title={date} placement="left" variant="plain">
                        <span>{time}</span>
                    </Tooltip>;
                }
            },
            {
                accessorKey: 'averageSpeed',
                header: 'Скорость'
            },
            {
                accessorKey: 'afterFlightCondition',
                header: 'Состояние'
            }
        ],
        []
    )

    const columnsOfficial = useMemo(() => [
            {
                accessorKey: 'position',
                header: 'Поз.'
            },
            {
                accessorKey: 'pigeonName',
                header: 'Кличка',
                size: 180
            },
            {
                accessorKey: 'ringNumber',
                header: 'Номер кольца',
                Cell: ({ cell,row }) => {
                    return <Link to={`/pigeons/${row.original.pigeonId}`}>{cell.getValue()}</Link>;
                }
            },
            {
                accessorKey: 'arrivalTime',
                header: 'Время финиша',
                Cell: ({ cell,row }) => {
                    const rawArrivalTime = dayjs.utc(cell.getValue()).local();
                    const time = rawArrivalTime.format("HH:mm:ss.SSS");
                    const date = rawArrivalTime.format("DD.MM.YYYY");
                    return <Tooltip title={date} placement="left" variant="plain">
                        <span>{time}</span>
                    </Tooltip>;
                }
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
                header: 'Тренер',
                size: 140
            }
        ],
        []
    );

    return <MaterialReactTable
        columns={official ? columnsOfficial : columnsTraining}
        data={data}
        defaultColumn={{minSize: 40, maxSize: 1000, size: 40}}
        localization={MRT_Localization_RU}
    />;
};

export default FlightTable;