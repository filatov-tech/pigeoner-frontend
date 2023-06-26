import React from 'react';
import {Table} from "react-bootstrap";
import '../../../styles/pigeon.css';

const TwoColumnTable = ({pigeon}) => {
    return (
        <Table striped bordered>
            <tbody>
                <tr>
                    <td className="name-column">Кличка</td>
                    <td>{pigeon.name}</td>
                </tr>
                <tr>
                    <td>Пол</td>
                    <td>{pigeon.sex}</td>
                </tr>
                <tr>
                    <td>Дата рождения</td>
                    <td>{pigeon.birthday}</td>
                </tr>
                <tr>
                    <td>Состояние</td>
                    <td>{pigeon.status}</td>
                </tr>
                <tr>
                    <td>Местонахождение</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Принадлежность</td>
                    <td>{pigeon.isNative ? "Свой" : "Чужой"}</td>
                </tr>
                <tr>
                    <td>Текущая пара</td>
                    <td>{pigeon.mate ? pigeon.mate : "Пары нет"}</td>
                </tr>
                <tr>
                    <td>Отец</td>
                    <td>{pigeon.fatherId ? pigeon.fatherId : "не определен"}</td>
                </tr>
                <tr>
                    <td>Мать</td>
                    <td>{pigeon.motherId ? pigeon.motherId : "не определена"}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default TwoColumnTable;