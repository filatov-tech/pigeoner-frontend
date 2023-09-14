import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useState} from "react";
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider, Stack} from "@mui/material";
import InputText from "../input/InputText";
import InputDate from "../input/InputDate";
import InputKeeperAutocompleteCreatable from "../input/Autocomplete/InputKeeperAutocompleteCreatable";
import {PIGEONS_URL, KEEPER_URL, MAIN_KEEPER_URL, makeOptions} from "../../../pages/pigeons";
import InputDovecoteAutocompleteCreatable, {
    HIERARCHICAL_SECTIONS_URL
} from "../input/Autocomplete/InputDovecoteAutocompleteCreatable";
import ControlledRadioGroup from "../radio/ControlledRadioGroup";
import InputColorAutocompleteCreatable from "../input/Autocomplete/InputColorAutocompleteCreatable";
import SelectCommon from "../input/SelectCommon";
import InputPigeonAutocomplete from "../input/Autocomplete/InputPigeonAutocomplete";
import {flatten} from "../../../util/utils";
import {addHierarchicalLabelsTo} from "../../../util/section-options-builder";
import {CloseOutlined, DoneOutlined} from "@mui/icons-material";
import Button from "@mui/material/Button";

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
    const [father, setFather] = useState("");
    const [mother, setMother] = useState("");
    const [mate, setMate] = useState("");

    const [pigeons, setPigeons] = useState([]);
    const [sectionsOptions, setSectionsOptions] = useState([]);

    const ringNumberData = new InputFieldData("ringNumber", ringNumber, "Номер кольца");
    const birthdateData = new InputFieldData("birthdate", birthdate, "Дата рождения");
    const nameData = new InputFieldData("name", name, "Кличка");
    const keeperData = new InputFieldData("keeper", keeper, "Владелец", "", props.keeperOptions);
    const dovecoteData = new InputFieldData("dovecote", dovecote, "Голубятня", "", sectionsOptions);
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
    const fatherData = new InputFieldData("father", father, "Отец", "", pigeons);
    const motherData = new InputFieldData("mother", mother, "Мать", "", pigeons);
    const mateData = new InputFieldData("mate", mate, "Пара", "", pigeons);

    const handleSubmit = () => {

    }

    useEffect(()=>{
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                json.label = json.name;
                setKeeper(json)
            });
        fetch(PIGEONS_URL)
            .then(resp => resp.json())
            .then(json => setPigeons(json));
        setSex("MALE");
        updateSectionsOptions();
        fatherData.sectionsOptions = sectionsOptions;
    }, [])

    const toggleSideForm = (openState) => {
        setOpen(openState);
    }

    const updateKeeperOptions = () => {
        fetch(KEEPER_URL)
            .then(res => res.json())
            .then(json => props.setKeeperOptions(makeOptions(json)))
    }

    const updateSectionsOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
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
                    <Chip label="Основные данные" sx={{fontSize:"1.2rem"}} />
                </Divider>
                <InputText data={ringNumberData} onChange={setRingNumber} required variant="standard" margin="dense"/>
                <InputDate data={birthdateData} onChange={setBirthdate}
                           slotProps={{textField: {variant: "standard", fullWidth: true, margin: "dense"}}}/>
                <InputText data={nameData} onChange={setName} variant="standard" margin="dense"/>
                <InputDovecoteAutocompleteCreatable data={dovecoteData} onChange={setDovecote} onSubmit={updateSectionsOptions} variant="standard" />
                <InputKeeperAutocompleteCreatable data={keeperData} onChange={setKeeper} updateKeepers={updateKeeperOptions} variant="standard"/>
                <Divider sx={{marginTop: "30px", marginBottom: "15px"}}>
                    <Chip label="Физ. параметры" sx={{fontSize:"1.2rem"}}/>
                </Divider>
                <ControlledRadioGroup data={sexData} onChange={setSex} />
                <InputColorAutocompleteCreatable data={colorData} onChange={setColor} variant="standard" />
                <SelectCommon data={conditionData} onChange={setCondition} withoutAny variant={"standard"} sx={{marginTop: "16px", marginBottom: "8px"}}/>
                <Divider sx={{marginTop: "30px"}}>
                    <Chip label="Связи" sx={{fontSize:"1.2rem"}} />
                </Divider>
                <InputPigeonAutocomplete data={fatherData} onChange={setFather} variant="standard" margin="dense" />
                <InputPigeonAutocomplete data={motherData} onChange={setMother} variant="standard" margin="dense" />
                <InputPigeonAutocomplete data={mateData} onChange={setMate} variant="standard" margin="dense" />
                <Stack direction="row" spacing={4} mt={6} mb={4}>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor:"#337ab7",
                            color:"#337ab7",
                            '&:hover': {
                                borderColor:"#337ab7"
                            }
                        }}
                        startIcon={<CloseOutlined fontSize="large" color="#337ab7"/>}>
                        Очистить
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor:"#337ab7",
                            borderColor:"#337ab7",
                            '&:hover': {
                                backgroundColor:"#286093"
                            }
                        }}
                        endIcon={<DoneOutlined fontSize="large"/>}>
                        Сохранить
                    </Button>
                </Stack>
            </form>
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);