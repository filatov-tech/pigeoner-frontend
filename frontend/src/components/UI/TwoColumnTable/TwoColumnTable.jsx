import React from 'react';
import Table from "@mui/joy/Table";
import '../../../styles/pigeon.css';

const TwoColumnTable = ({pigeon}) => {
    return (
        <Table variant="soft" borderAxis="xBetween" sx={{marginBottom: "20px"}}>
            <tbody>
                <tr>
                    <th scope="row" className="name-column">Кличка</th>
                    <td>{pigeon.name}</td>
                </tr>
                <tr>
                    <th scope="row">Пол</th>
                    <td>{pigeon.sex === "male" ? "самец" : "самка"}</td>
                </tr>
                <tr>
                    <th scope="row">Дата рождения</th>
                    <td>{pigeon.birthdate}</td>
                </tr>
                <tr>
                    <th scope="row">Состояние</th>
                    <td>{pigeon.condition}</td>
                </tr>
                <tr>
                    <th scope="row">Голубятня</th>
                    <td>{pigeon.section && pigeon.section.rootName}</td>
                </tr>
                <tr>
                    <th scope="row">Точное место</th>
                    <td>{pigeon.section && pigeon.section.fullAddress}</td>
                </tr>
                <tr>
                    <th scope="row">Принадлежность</th>
                    <td>{pigeon.isOwn ? "Свой" : "Чужой"}</td>
                </tr>
                <tr>
                    <th scope="row">Текущая пара</th>
                    <td>{pigeon.mate && pigeon.mate.ringNumber}</td>
                </tr>
                <tr>
                    <th scope="row">Отец</th>
                    <td>{pigeon.fatherId && pigeon.father.ringNumber}</td>
                </tr>
                <tr>
                    <th scope="row">Мать</th>
                    <td>{pigeon.motherId && pigeon.mother.ringNumber}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default TwoColumnTable;