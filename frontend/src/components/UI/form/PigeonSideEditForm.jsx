import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useState} from "react";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider} from "@mui/material";
import InputText from "../input/InputText";
import InputDate from "../input/InputDate";
import InputKeeperAutocompleteCreatable from "../input/InputKeeperAutocompleteCreatable";
import {KEEPER_URL, MAIN_KEEPER_URL, makeOptions} from "../../../pages/pigeons";
import InputDovecoteAutocompleteCreatable from "../input/InputDovecoteAutocompleteCreatable";
import ControlledRadioGroup from "../radio/ControlledRadioGroup";

const PigeonSideEditForm = (props, ref) => {

    const [isOpen, setOpen] = useState();

    const [ringNumber, setRingNumber] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [name, setName] = useState("");
    const [keeper, setKeeper] = useState({});
    const [dovecote, setDovecote] = useState(null);
    const [sex, setSex] = useState("");

    const ringNumberData = new InputFieldData("ringNumber", ringNumber, "Номер кольца");
    const birthdateData = new InputFieldData("birthdate", birthdate, "Дата рождения");
    const nameData = new InputFieldData("name", name, "Кличка");
    const keeperData = new InputFieldData("keeper", keeper, "Владелец", "", props.keeperOptions);
    const dovecoteData = new InputFieldData("dovecote", dovecote, "Голубятня");
    const sexData = new InputFieldData("sex", sex, "Пол", "", [
        {value: "MALE", label: "Самец"},
        {value: "FEMALE", label: "Самка"}
    ])

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
        setSex("MALE");
    }, [])

    const handleChange = (data) => {
        const updateStateFunction = setStateMap.get(data.name);
        updateStateFunction(data.value);
    }

    const toggleSideForm = (openState) => {
        setOpen(openState);
    }

    const updateKeeperOptions = () => {
        fetch(KEEPER_URL)
            .then(res => res.json())
            .then(json => props.setKeeperOptions(makeOptions(json)))
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
                <InputDovecoteAutocompleteCreatable data={dovecoteData} setValue={setDovecote} variant="standard" />
                <InputKeeperAutocompleteCreatable data={keeperData} setValue={setKeeper} updateKeepers={updateKeeperOptions} variant="standard"/>
                <Divider sx={{marginTop: "30px", marginBottom: "15px"}}>
                    <Chip label="Физ. параметры"/>
                </Divider>
                <ControlledRadioGroup data={sexData} onChange={setSex} />

            </form>
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);