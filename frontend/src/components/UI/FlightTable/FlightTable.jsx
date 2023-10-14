import React, {useMemo, useRef, useState} from 'react';
import {MaterialReactTable} from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {Tooltip} from "@mui/joy";
import {ListItemIcon, MenuItem} from "@mui/material";
import {DeleteForever, Edit} from "@mui/icons-material";
import {AfterFlightCondition} from "../../../constants";
import DeleteFlightResultDialog from "../form/confirm-action/SimpleDeletionConfirmDialog";

const FlightTable = ({data, official, onEdit, onDelete}) => {
    const deleteDialogRef = useRef();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
                    let rawArrivalTime = dayjs.utc(cell.getValue());
                    if (rawArrivalTime.isValid()) {
                        rawArrivalTime = rawArrivalTime.local();
                        const time = rawArrivalTime.format("HH:mm:ss.SSS");
                        const date = rawArrivalTime.format("DD.MM.YYYY");
                        return <Tooltip title={date} placement="left" variant="plain">
                            <span>{time}</span>
                        </Tooltip>;
                    } else {
                        return <Link to={`/pigeons/${row.original.pigeonId}`}></Link>;
                    }
                }
            },
            {
                accessorKey: 'averageSpeed',
                header: 'Скорость'
            },
            {
                accessorKey: 'afterFlightCondition',
                header: 'Состояние',
                Cell: ({cell, row}) => {
                    const name = AfterFlightCondition[cell.getValue()];
                    return <span>{name}</span>
                }
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
                header: 'Состояние',
                Cell: ({cell, row}) => {
                    const name = AfterFlightCondition[cell.getValue()];
                    return <span>{name}</span>
                }
            },
            {
                accessorKey: 'keeper',
                header: 'Тренер',
                size: 140
            }
        ],
        []
    );

    return (<React.Fragment>
        <MaterialReactTable
            columns={official ? columnsOfficial : columnsTraining}
            data={data}
            defaultColumn={{minSize: 40, maxSize: 1000, size: 40}}
            localization={{
                ...MRT_Localization_RU,
                actions: ""
            }}
            enableRowActions
            renderRowActionMenuItems={({row, closeMenu}) => [
                <MenuItem
                    key="editMenuItem"
                    onClick={() => {
                        onEdit(row.original);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <Edit/>
                    </ListItemIcon>
                    Изменить
                </MenuItem>,
                <MenuItem
                    key="deleteMenuItem"
                    onClick={() => {
                        deleteDialogRef.current.startDeletion(row.original.id);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <DeleteForever/>
                    </ListItemIcon>
                    Удалить
                </MenuItem>
            ]}
        />
        <DeleteFlightResultDialog
            ref={deleteDialogRef}
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            handleDelete={onDelete}
            title="Удаление участника"
            content="Данный участник будет удален из текущего вылета"
        />
    </React.Fragment>)
};

export default FlightTable;