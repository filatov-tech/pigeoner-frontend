import React, {useState, useEffect, useRef} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonFilterForm, {MAIN_KEEPER_URL} from "../components/UI/PigeonTable/PigeonFilterForm";
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";
import ButtonWithPigeons from "../components/UI/button/ButtonWithPigeons";

const Pigeons = () => {

    const [tableData, setTableData] = useState();
    const [filterError, setFilterError] = useState();
    const [hasError, setHasError] = useState(false);
    const [mainKeeper, setMainKeeper] = useState('');

    const formRef = useRef();

    const GET_PIGEONS_URL = '/api/v1/pigeons';

    useEffect(() => {
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                setMainKeeper(json.id);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mainKeeper && mainKeeper !== '') {
            updateTable({keeper: mainKeeper})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainKeeper])

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

    const handleSubmit = () => {
        formRef.current.handleSubmit();
    }

    const resetFilters = () => {
        formRef.current.resetFilters();
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Голуби</h1>
                    <hr/>
                    <PigeonFilterForm submitButton={updateTable} ref={formRef}/>
                    {filterError && <ErrorSnackbar message={filterError.message} close={closeAlert}/>}
                </Col>
                <div className="col-12 manage-panel">
                    <button id="filter" onClick={handleSubmit}
                            className="btn btn-primary btn-lg manage-panel-item"
                            type="button" style={{background: "rgb(51,122,183)", width: 150 + "px"}}>
                        Найти
                    </button>
                    <button className="btn btn-light btn-lg manage-panel-item" type="reset" onClick={resetFilters}>Сбросить</button>
                    <div className="manage-panel-item invisible-item"></div>
                    <div className="manage-panel-item">
                        <ButtonWithPigeons/>
                    </div>
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