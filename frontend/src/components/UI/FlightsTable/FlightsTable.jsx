import React, {useMemo} from 'react';
import { MaterialReactTable } from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import dayjs from "dayjs";

const FlightsTable = ({data}) => {
    const addLinkToCell = function () {
        return ({cell, row}) => {
            return <>
                {cell.getValue()}
                <Link to={`/flights/${row.original.id}`} className="table-link"></Link>
            </>;
        };
    }

    const columns = useMemo(() => [
            {
                accessorKey: 'flightType',
                header: 'Тип вылета',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'launchPoint.name',
                header: 'Место выпуска',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'launchPoint.distance',
                header: 'Дистанция, км',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'numberParticipants',
                header: 'Мои голуби',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'myPassed',
                header: 'В зачете',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'totalParticipants',
                header: 'Всего участников',
                Cell: addLinkToCell()
            },
            {
                accessorKey: 'departure',
                header: 'Выпуск',
                Cell: ({cell, row}) => {
                    const rawDeparture = dayjs(cell.getValue());
                    return <>
                        <span>{rawDeparture.format("DD.MM.YYYY HH:mm")}</span>
                        <Link to={`/flights/${row.original.id}`} className="table-link"></Link>
                    </>
                }
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
        muiTableBodyCellProps={{
            sx: {
                position: "relative"
            }
        }}
        localization={MRT_Localization_RU}
    />;
};

export default FlightsTable;