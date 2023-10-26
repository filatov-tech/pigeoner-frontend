import React, {useEffect, useRef, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import '../styles/pigeons.css';
import PigeonTable from "../components/UI/PigeonTable/PigeonTable";
import ErrorSnackbar from "../components/UI/ErrorSnackbar";
import PigeonSideEditForm from "../components/UI/form/PigeonSideEditForm";
import PigeonFilterForm from "../components/UI/PigeonTable/PigeonFilterForm";
import {AUTH_TOKEN, BEARER, KEEPER_URL, MAIN_KEEPER_URL, PIGEONS_URL} from "../constants";
import Grid from "@mui/material/Unstable_Grid2";
import {Button} from "@mui/joy";

const Pigeons = () => {
    const [tableData, setTableData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainKeeperId, setMainKeeperId] = useState('');
    const [keeperOptions, setKeeperOptions] = useState([]);

    const formRef = useRef();
    const sideEditFormRef = useRef();

    useEffect(() => {
        fetch(MAIN_KEEPER_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => {
                setMainKeeperId(json.id);
            });
        fetch(KEEPER_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
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
                    "Content-Type": "application/json",
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
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
            const response = await fetch(PIGEONS_URL, {
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            });
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
                <Grid container spacing={2}>
                    <Grid xs={6} sm md lg xl>
                        <Button
                            variant="solid"
                            size="lg"
                            sx={{backgroundColor: "#337ab7"}}
                            onClick={handleSubmit}
                            fullWidth
                        >
                            Найти
                        </Button>
                    </Grid>
                    <Grid xs={6} sm md lg xl>
                        <Button
                            variant="soft"
                            size="lg"
                            onClick={resetFilters}
                            fullWidth
                        >
                            Сбросить
                        </Button>
                    </Grid>
                    <Grid xs={0} lg={5} xl={6}>

                    </Grid>
                    <Grid xs={12} sm={12} md lg xl sx={{paddingRight: 0}}>
                        <Button
                            variant="solid"
                            size="lg"
                            sx={{backgroundColor: "#337ab7"}}
                            onClick={openSideEditPanel}
                            fullWidth

                        >
                            Добавить голубя
                        </Button>
                        <PigeonSideEditForm
                            ref={sideEditFormRef}
                            handleSubmit={handleSubmit}
                            keeperOptions={keeperOptions}
                            setKeeperOptions={setKeeperOptions}
                        />
                    </Grid>
                </Grid>
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