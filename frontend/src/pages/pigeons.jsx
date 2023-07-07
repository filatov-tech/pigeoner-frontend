import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonFilterForm from "../components/UI/PigeonTable/PigeonFilterForm";
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";

const Pigeons = () => {

    const [tableData, setTableData] = useState();

    useEffect(() => {
        fetch('/api/v1/pigeons')
            .then(res => res.json())
            .then(json => setTableData(json));
    }, []);

    function updateTable(formData) {
        const url = formData ? `/api/v1/pigeons/filter?${formData}` : '/api/v1/pigeons';
        fetch(url)
            .then(res => res.json())
            .then(json => setTableData(json));
    }

    return (
        <Container>
            <Row>
                <div className="col-12">
                    <h1>Голуби</h1>
                    <hr/>
                    <PigeonFilterForm submit={updateTable}/>
                </div>
            </Row>
            <Row>
                <Col className="table-box">
                    {tableData  ? <PigeonTable data={tableData}/> : <TableSkeletonLoader/>}
                </Col>
            </Row>
        </Container>
    );
};

export default Pigeons;