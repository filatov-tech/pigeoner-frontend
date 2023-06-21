import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonFilterForm from "../components/UI/pigeonsTable/PigeonFilterForm";

const Pigeons = () => {
    return (
        <Container>
            <Row>
                <div className="col-12">
                    <PigeonFilterForm />
                </div>
            </Row>
            <Row>
                <Col>



                    {/*<div className="table-responsive text-center">*/}
                    {/*    <table id="pigeons-table" className="table table-striped table-hover">*/}
                    {/*        <thead className="text-center pigeons-table-head">*/}
                    {/*        <tr>*/}
                    {/*            <th>Кольцо</th>*/}
                    {/*            <th>Окрас</th>*/}
                    {/*            <th>Пол</th>*/}
                    {/*            <th>Родился</th>*/}
                    {/*            <th>Возраст</th>*/}
                    {/*            <th>Пара</th>*/}
                    {/*            <th>Статус</th>*/}
                    {/*            <th></th>*/}
                    {/*        </tr>*/}
                    {/*        </thead>*/}
                    {/*        <tbody></tbody>*/}
                    {/*    </table>*/}
                    {/*</div>*/}
                </Col>
            </Row>
        </Container>

    );
};

export default Pigeons;