import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useState} from "react";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import SideEditForm from "../SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider} from "@mui/material";
import InputText from "../input/InputText";
import InputDate from "../input/InputDate";
import InputKeeperAutocompleteCreatable from "../input/InputKeeperAutocompleteCreatable";
import {MAIN_KEEPER_URL} from "../../../pages/pigeons";

const PigeonSideEditForm = (props, ref) => {

    const [isOpen, setOpen] = useState();

    const [ringNumber, setRingNumber] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [name, setName] = useState("");
    const [keeper, setKeeper] = useState({});

    const ringNumberData = new InputFieldData("ringNumber", ringNumber, "Номер кольца");
    const birthdateData = new InputFieldData("birthdate", birthdate, "Дата рождения");
    const nameData = new InputFieldData("name", name, "Кличка");
    const keeperData = new InputFieldData("keeper", keeper, "Владелец", "", props.keeperOptions);

    // TODO: Убрать эту чушь
    const setStateMap = new Map();
    setStateMap.set("ringNumber", setRingNumber);
    setStateMap.set("birthdate", setBirthdate);
    setStateMap.set("name", setName);
    setStateMap.set("keeper", setKeeper);

    const handleSubmit = () => {

    }

    useEffect(()=>{
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                json.label = json.name;
                setKeeper(json)
            });

    }, [])

    const handleChange = (data) => {
        const updateStateFunction = setStateMap.get(data.name);
        updateStateFunction(data.value);
    }

    const toggleSideForm = (openState) => {
        setOpen(openState);
    }

    useImperativeHandle(ref, () => ({
        toggleSideForm
    }))

    return (
        <SideEditForm  open={isOpen} onClose={() => toggleSideForm(false)} >
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" align="center" gutterBottom>
                    Новый голубь
                </Typography>
                <Divider>
                    <Chip label="Основные данные"/>
                </Divider>
                <InputText data={ringNumberData} onChange={handleChange} required variant="standard" margin="dense"/>
                <InputDate data={birthdateData} onChange={handleChange}
                           slotProps={{textField: {variant: "standard", fullWidth: true, margin: "dense"}}}/>
                <InputText data={nameData} onChange={handleChange} variant="standard" margin="dense"/>
                {/*<SelectCommon data={keeperData} onChange={handleChange} variant="standard" sx={{margin: "dense"}}/>*/}
                <InputKeeperAutocompleteCreatable data={keeperData} setValue={setKeeper} variant="standard"/>
            </form>
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);