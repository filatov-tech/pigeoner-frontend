import React, {useState, useEffect, useRef} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import TableSkeletonLoader from "../components/UI/loader/TableSkeletonLoader";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";
import ButtonWithPigeons from "../components/UI/button/ButtonWithPigeons";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";
import PigeonFilterForm from "../components/UI/PigeonTable/PigeonFilterForm";

export const KEEPER_URL = '/api/v1/keepers';
export const MAIN_KEEPER_URL = KEEPER_URL + '/main';

const Pigeons = () => {
    const [tableData, setTableData] = useState();
    const [filterError, setFilterError] = useState();
    const [hasError, setHasError] = useState(false);
    const [mainKeeperId, setMainKeeperId] = useState('');
    const [keeperOptions, setKeeperOptions] = useState([]);

    const formRef = useRef();
    const sideEditFormRef = useRef();

    const GET_PIGEONS_URL = '/api/v1/pigeons';

    useEffect(() => {
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                setMainKeeperId(json.id);
            });
        fetch(KEEPER_URL)
            .then(res => res.json())
            .then(json => setKeeperOptions(makeOptions(json)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mainKeeperId && mainKeeperId !== '') {
            updateTable({keeper: mainKeeperId})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainKeeperId])

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

    const openSideEditPanel = () => {
        sideEditFormRef.current.toggleSideForm(true);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Голуби</h1>
                    <hr/>
                    <PigeonFilterForm
                        submitButton={updateTable}
                        ref={formRef}
                        keeperOptions={keeperOptions}
                        setKeeperOptions={setKeeperOptions} />
                    {filterError && <ErrorSnackbar message={filterError.message} onClose={closeAlert}/>}
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
                        <ButtonWithPigeons onClick={openSideEditPanel}/>
                        <PigeonSideEditForm ref={sideEditFormRef} keeperOptions={keeperOptions} setKeeperOptions={setKeeperOptions} />
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

export const makeOptions = (data) => {
    const result = [];
    if (!Array.isArray(data))
        return data.id;
    data.forEach(element => result.push({value: element.id, label: element.name}));
    return result;
}

export default Pigeons;