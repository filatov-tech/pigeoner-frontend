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
import ErrorSnackbar from "../ErrorSnackbar";
import ImageUpload from "../ImageUpload";
import dayjs from 'dayjs';

const PigeonSideEditForm = (props, ref) => {

    const [isOpen, setOpen] = useState();
    const [editMode] = useState(!!props.pigeon)
    const [initialized, setInitialized] = useState(false);

    const [ringNumber, setRingNumber] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [name, setName] = useState(null);
    const [keeper, setKeeper] = useState(null);
    const [dovecote, setDovecote] = useState(null);
    const [sex, setSex] = useState(null);
    const [color, setColor] = useState(null);
    const [condition, setCondition] = useState("HEALTH");
    const [father, setFather] = useState(null);
    const [mother, setMother] = useState(null);
    const [mate, setMate] = useState(null);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);

    const [previewImages, setPreviewImages] = useState([]);

    const [pigeons, setPigeons] = useState([]);
    const [sectionsOptions, setSectionsOptions] = useState([]);
    const [keeperOptions, setKeeperOptions] = useState([])
    const [mainKeeper, setMainKeeper] = useState(null);

    const ringNumberData = new InputFieldData("ringNumber", ringNumber, "Номер кольца");
    const birthdateData = new InputFieldData("birthdate", birthdate, "Дата рождения");
    const nameData = new InputFieldData("name", name, "Кличка");
    const keeperData = new InputFieldData(
        "keeper",
        keeper,
        "Владелец",
        "",
        props.keeperOptions ? props.keeperOptions : keeperOptions);
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
        {value: "LOST", label: "Потерян"},
        {value: "UNKNOWN", label: "Неизвестно"}
    ]);
    const fatherData = new InputFieldData("father", father, "Отец", "", pigeons);
    const motherData = new InputFieldData("mother", mother, "Мать", "", pigeons);
    const mateData = new InputFieldData("mate", mate, "Пара", "", pigeons);

    const [error, setError] = useState(null);
    const [fieldErrorData, setFieldErrorData] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pigeon = {
            ringNumber: ringNumber,
            birthdate: birthdate,
            name: name,
            keeperId: keeper && keeper.id,
            sectionId: dovecote && dovecote.id,
            sex: sex,
            color: color && color.name,
            condition: condition,
            fatherId: father && father.id,
            motherId: father && mother.id,
            mateId: mate && mate.id,
            mainImageFileName: mainImage
        };
        const formData = new FormData();
        formData.append("pigeon", new Blob([JSON.stringify(pigeon)], {type: "application/json"}));
        images.forEach(image => formData.append("images", image));

        const response = await fetch(PIGEONS_URL, {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            clearForm();
            setError(null);
            setFieldErrorData({});
            toggleSideForm(false);
            props.handleSubmit();
        } else {
            const apiError = await response.json();
            setError(apiError);
            if (apiError.fields) {
                for (const [key, value] of Object.entries(apiError.fields)) {
                    value.disable = disableErrorByFieldName;
                }
                setFieldErrorData(apiError.fields);
            }
        }
    }

    function initFormWith(pigeon) {
        setRingNumber(pigeon.ringNumber);
        setBirthdate(pigeon.birthdate ? dayjs(pigeon.birthdate) : null);
        setName(pigeon.name);
        setKeeper({value: pigeon.keeperId, label: pigeon.keeperName});
        setDovecote(sectionsOptions.find(section => section.id === pigeon.sectionId));
        setSex(pigeon.sex.toUpperCase());
        setColor(pigeon.color);
        setCondition(conditionData.options.find(item => item.label === pigeon.condition).value);
        setFather(pigeon.father);
        setMother(pigeon.mother);
        setMate(pigeon.mate);
        setImages(pigeon.images);
        setPreviewImages(previewImages => {
            const newPreviews = [];
            pigeon.images && pigeon.images.forEach(image => {
                newPreviews.push({image: image, fileName: image.name, isMain: false})
            })
            return [...previewImages, ...newPreviews]
        });

        setInitialized(true);
    }

    useEffect( ()=>{
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                json.label = json.name;
                setKeeper(json);
                setMainKeeper(json);
            });
        fetch(PIGEONS_URL)
            .then(resp => resp.json())
            .then(json => setPigeons(json));
        updateSectionsOptions()
        if (!props.keeperOptions) {
            fetch(KEEPER_URL)
                .then(res => res.json())
                .then(json => setKeeperOptions(makeOptions(json)))
        }
        fatherData.sectionsOptions = sectionsOptions;
        setSex("MALE");
    }, [])

    useEffect(()=> {
        if (sectionsOptions.length > 0 && editMode && !initialized) {
            initFormWith(props.pigeon);
        }
    }, [sectionsOptions])

    const toggleSideForm = (openState) => {
        setOpen(openState);
    }

    const updateKeeperOptions = () => {
        fetch(KEEPER_URL)
            .then(res => res.json())
            .then(json => props.keeperOptions ? props.setKeeperOptions(makeOptions(json)) : setKeeperOptions(makeOptions(json)))
    }

    const updateSectionsOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL)
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }

    const disableErrorByFieldName = (fieldName) => {
        setFieldErrorData(prevState => {
            return {...prevState, [fieldName]: null};
        })
    }

    const clearForm = () => {
        setRingNumber("");
        setBirthdate(null);
        setName(null);
        setKeeper(mainKeeper);
        setDovecote(null);
        setSex("MALE");
        setColor(null);
        setCondition("HEALTH");
        setFather(null);
        setMother(null);
        setMate(null);
        setImages([]);
        setPreviewImages([]);
    }

    const closeErrorAlert = () => {
        setError(null);
    }

    useImperativeHandle(ref, () => ({
        toggleSideForm
    }))

    return (
        <SideEditForm  open={isOpen} onClose={() => toggleSideForm(false)} >
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" align="center" gutterBottom>
                    {editMode
                        ? `Голубь ${ringNumber}`
                        : "Новый голубь"}
                </Typography>
                <Divider sx={{marginBottom: "15px"}}>
                    <Chip label="Основные данные" sx={{fontSize:"1.2rem"}} />
                </Divider>
                <InputText
                    data={ringNumberData}
                    onChange={setRingNumber}
                    error={fieldErrorData.ringNumber}
                    required
                    variant="standard" />
                <InputDate
                    data={birthdateData}
                    onChange={setBirthdate}
                    error={fieldErrorData.birthdate}
                    slotProps={{textField: {variant: "standard", fullWidth: true}}}/>
                <InputText
                    data={nameData}
                    onChange={setName}
                    error={fieldErrorData.name}
                    variant="standard" />
                <InputDovecoteAutocompleteCreatable
                    data={dovecoteData}
                    onChange={setDovecote}
                    error={fieldErrorData.section}
                    onSubmit={updateSectionsOptions}
                    variant="standard" />
                <InputKeeperAutocompleteCreatable
                    data={keeperData}
                    onChange={setKeeper}
                    error={fieldErrorData.keeper}
                    updateKeepers={updateKeeperOptions}
                    variant="standard"/>
                <Divider sx={{marginTop: "30px", marginBottom: "15px"}}>
                    <Chip label="Физ. параметры" sx={{fontSize:"1.2rem"}}/>
                </Divider>
                <ControlledRadioGroup data={sexData} onChange={setSex} />
                <InputColorAutocompleteCreatable
                    data={colorData}
                    onChange={setColor}
                    error={fieldErrorData.color}
                    variant="standard" />
                <SelectCommon
                    data={conditionData}
                    onChange={setCondition}
                    error={fieldErrorData.condition}
                    withoutAny
                    variant={"standard"}
                    sx={{marginTop: "16px", marginBottom: "8px"}}/>
                <Divider sx={{marginTop: "30px"}}>
                    <Chip label="Связи" sx={{fontSize:"1.2rem"}} />
                </Divider>
                <InputPigeonAutocomplete
                    data={fatherData}
                    onChange={setFather}
                    error={fieldErrorData.father}
                    variant="standard" />
                <InputPigeonAutocomplete
                    data={motherData}
                    onChange={setMother}
                    error={fieldErrorData.mother}
                    variant="standard" />
                <InputPigeonAutocomplete
                    data={mateData}
                    onChange={setMate}
                    error={fieldErrorData.mate}
                    variant="standard" />
                <Divider sx={{marginTop: "30px"}}>
                    <Chip label="Фото" sx={{fontSize:"1.2rem"}} />
                </Divider>
                <ImageUpload
                    images={editMode ? props.pigeon.images : undefined}
                    setImages={setImages}
                    setMainImage={setMainImage}
                    previewImages={previewImages}
                    setPreviewImages={setPreviewImages} />
                <Stack direction="row" spacing={4} mt={6} mb={4}>
                    <Button
                        variant="outlined"
                        size="large"
                        type="button"
                        onClick={clearForm}
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
                        type="submit"
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
            {error && <ErrorSnackbar message={error.message} onClose={closeErrorAlert}/>}
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);