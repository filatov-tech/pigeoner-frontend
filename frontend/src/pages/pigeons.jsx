import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonFilterForm from "../components/UI/PigeonTable/PigeonFilterForm";
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import {Snackbar} from "@mui/material";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";

const Pigeons = () => {

    const [tableData, setTableData] = useState();
    const [filterError, setFilterError] = useState();
    const [hasError, setHasError] = useState(false);

    const GET_PIGEONS_URL = '/api/v1/pigeons';

    useEffect(() => loadTable(), []);

    const updateTable = formData => {
        if (!formData) {
            loadTable();
            return;
        }
        fetch(GET_PIGEONS_URL + '/filter', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Test")
                }
                return res.json();
            })
            .then(
                json => setTableData(json),
                err => setFilterError(err)
            );
    }

    const loadTable = () => {
        fetch(GET_PIGEONS_URL)
            .then(res => res.json())
            .then(json => setTableData(json));
    }

    function closeAlert() {
        setHasError(false);
        setFilterError(null);
    }

    return (
        <Container>
            <Row>
                <div className="col-12">
                    <h1>Голуби</h1>
                    <hr/>
                    <PigeonFilterForm submit={updateTable}/>
                    {filterError && <ErrorSnackbar message={filterError.message} close={closeAlert}/>}
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