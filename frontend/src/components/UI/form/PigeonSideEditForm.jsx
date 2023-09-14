import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useState} from "react";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider} from "@mui/material";
import InputText from "../input/InputText";
import InputDate from "../input/InputDate";
import InputKeeperAutocompleteCreatable from "../input/Autocomplete/InputKeeperAutocompleteCreatable";
import {KEEPER_URL, MAIN_KEEPER_URL, makeOptions} from "../../../pages/pigeons";
import InputDovecoteAutocompleteCreatable from "../input/Autocomplete/InputDovecoteAutocompleteCreatable";
import ControlledRadioGroup from "../radio/ControlledRadioGroup";
import InputColorAutocompleteCreatable from "../input/Autocomplete/InputColorAutocompleteCreatable";
import SelectCommon from "../input/SelectCommon";

const PigeonSideEditForm = (props, ref) => {

    const [isOpen, setOpen] = useState();

    const [ringNumber, setRingNumber] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [name, setName] = useState("");
    const [keeper, setKeeper] = useState({});
    const [dovecote, setDovecote] = useState(null);
    const [sex, setSex] = useState("");
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState("");

    const ringNumberData = new InputFieldData("ringNumber", ringNumber, "Номер кольца");
    const birthdateData = new InputFieldData("birthdate", birthdate, "Дата рождения");
    const nameData = new InputFieldData("name", name, "Кличка");
    const keeperData = new InputFieldData("keeper", keeper, "Владелец", "", props.keeperOptions);
    const dovecoteData = new InputFieldData("dovecote", dovecote, "Голубятня");
    const sexData = new InputFieldData("sex", sex, "Пол", "", [
        {value: "MALE", label: "Самец"},
        {value: "FEMALE", label: "Самка"}
    ]);
    const colorData = new InputFieldData("color", color, "Окрас");
    const conditionData = new InputFieldData("condition", condition, "Состояние", "", [
        {value: "HEALTH", label: "Здоров"},
        {value: "DISEASED", label: "Болен"},
        {value: "DEAD", label: "Умер"},
        {value: "LOST", label: "Потерян"}
    ]);

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

    // const handleChange = (data) => {
    //     const updateStateFunction = setStateMap.get(data.name);
    //     updateStateFunction(data.value);
    // }

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
                <InputText data={ringNumberData} onChange={setRingNumber} required variant="standard" margin="dense"/>
                <InputDate data={birthdateData} onChange={setBirthdate}
                           slotProps={{textField: {variant: "standard", fullWidth: true, margin: "dense"}}}/>
                <InputText data={nameData} onChange={setName} variant="standard" margin="dense"/>
                <InputDovecoteAutocompleteCreatable data={dovecoteData} onChange={setDovecote} variant="standard" />
                <InputKeeperAutocompleteCreatable data={keeperData} onChange={setKeeper} updateKeepers={updateKeeperOptions} variant="standard"/>
                <Divider sx={{marginTop: "30px", marginBottom: "15px"}}>
                    <Chip label="Физ. параметры"/>
                </Divider>
                <ControlledRadioGroup data={sexData} onChange={setSex} />
                <InputColorAutocompleteCreatable data={colorData} onChange={setColor} variant="standard" />
                <SelectCommon data={conditionData} onChange={setCondition} withoutAny variant={"standard"}/>
            </form>
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);