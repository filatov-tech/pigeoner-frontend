import React, {useState, useEffect, useRef} from 'react';
import { Container, Row, Col } from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";
import ButtonWithPigeons from "../components/UI/button/ButtonWithPigeons";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";
import PigeonFilterForm from "../components/UI/PigeonTable/PigeonFilterForm";

export const KEEPER_URL = '/api/v1/keepers';
export const MAIN_KEEPER_URL = KEEPER_URL + '/main';
export const PIGEONS_URL = '/api/v1/pigeons';

export const Sex = {
    MALE: "самец",
    FEMALE: "самка"
}

const Pigeons = () => {
    const [tableData, setTableData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainKeeperId, setMainKeeperId] = useState('');
    const [keeperOptions, setKeeperOptions] = useState([]);

    const formRef = useRef();
    const sideEditFormRef = useRef();

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

    const updateTable = async (formData) => {
        if (!formData) {
            loadTable();
            return;
        }
        try {
            const response = await fetch(PIGEONS_URL + '/filter', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const filteredPigeons = await response.json();
                setTableData(filteredPigeons);
                setIsLoading(false);
            } else {
                const apiError = await response.json();
                setError(apiError);
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке отфильтрованных данных голубей для таблицы", e);
        }
    }

    const loadTable = async () => {
        try {
            const response = await fetch(PIGEONS_URL);
            if (response.ok) {
                const pigeons = await response.json();
                setTableData(pigeons);
                setIsLoading(false);
            } else {
                const apiError = await response.json();
                setError(apiError);
            }
        } catch (e) {
            throw new Error("Ошибка при загрузке данных голубей для таблицы", e);
        }
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

    const closeErrorAlert = () => {
        setError(null);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [error]);

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
                </Col>
                <div className="col-12 manage-panel">
                    <button id="filter" onClick={handleSubmit}
                            className="btn btn-primary btn-lg manage-panel-item"
                            type="button" style={{background: "#337ab7", width: 150 + "px"}}>
                        Найти
                    </button>
                    <button className="btn btn-light btn-lg manage-panel-item" type="reset" onClick={resetFilters}>Сбросить</button>
                    <div className="manage-panel-item invisible-item"></div>
                    <div className="manage-panel-item">
                        <ButtonWithPigeons onClick={openSideEditPanel}/>
                        <PigeonSideEditForm
                            ref={sideEditFormRef}
                            handleSubmit={handleSubmit}
                            keeperOptions={keeperOptions}
                            setKeeperOptions={setKeeperOptions}
                        />
                    </div>
                </div>
            </Row>
            <Row>
                <Col className="table-box">
                    <PigeonTable data={tableData} isLoading={isLoading} />
                </Col>
            </Row>
            {error && <ErrorSnackbar message={error.message} onClose={closeErrorAlert}/>}
        </Container>
    );
};

export const makeOptions = (data) => {
    const result = [];
    if (!Array.isArray(data))
        return data.id;
    data.forEach(element => result.push({...element, value: element.id, label: element.name}));
    return result;
}

export default Pigeons;