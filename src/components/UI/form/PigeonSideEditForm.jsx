import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {InputFieldData} from "../PigeonTable/PigeonFilterForm";
import SideEditForm from "./SideEditForm";
import Typography from "@mui/material/Typography";
import {Chip, Divider, Stack} from "@mui/material";
import InputText from "../input/InputText";
import InputDate from "../input/InputDate";
import InputKeeperAutocompleteCreatable from "../input/Autocomplete/InputKeeperAutocompleteCreatable";
import {
    AUTH_TOKEN,
    BEARER,
    HIERARCHICAL_SECTIONS_URL,
    KEEPER_URL,
    MAIN_KEEPER_URL,
    PIGEONS_URL
} from "../../../constants"
import {makeOptions} from "../../../pages/pigeons";
import InputDovecoteAutocompleteCreatable from "../input/Autocomplete/InputDovecoteAutocompleteCreatable";
import ControlledRadioGroup from "../radio/ControlledRadioGroup";
import InputColorAutocompleteCreatable from "../input/Autocomplete/InputColorAutocompleteCreatable";
import SelectCommon from "../input/SelectCommon";
import InputPigeonAutocomplete from "../input/Autocomplete/InputPigeonAutocomplete";
import {flatten} from "../../../util/utils";
import {addHierarchicalLabelsTo} from "../../../util/section-options-builder";
import Button from "@mui/joy/Button";
import ErrorSnackbar from "../ErrorSnackbar";
import ImageUpload from "../ImageUpload";
import dayjs from 'dayjs';
import {ButtonGroup, Tooltip} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import {Close} from "@mui/icons-material";
import {isoCountriesRuOptions} from "../../../util/country-codes";

const PigeonSideEditForm = (props, ref) => {

    const [isOpen, setOpen] = useState();
    const [editMode] = useState(!!props.pigeon)
    const [initialized, setInitialized] = useState(false);

    const [pigeonId, setPigeonId] = useState(null);
    const [ringNumber, setRingNumber] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [name, setName] = useState("");
    const [countryCode, setCountryCode] = useState("");
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
    const countryCodeData = new InputFieldData("countryCode", countryCode, "Страна происхождения", "", isoCountriesRuOptions);
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
            id: pigeonId,
            ringNumber: ringNumber,
            birthdate: birthdate,
            name: name,
            countryCode: countryCode,
            keeperId: keeper && keeper.id,
            sectionId: dovecote && dovecote.id,
            sex: sex,
            color: color && color.name,
            condition: condition,
            fatherId: father && father.id,
            motherId: mother && mother.id,
            mateId: mate && mate.id,
            mainImageFileName: mainImage
        };

        const fetchData = prepareFetchData(pigeon);
        const response = await fetch(fetchData.url, fetchData.options);
        if (response.ok) {
            if (!editMode) {
                resetForm();
            }
            setError(null);
            setFieldErrorData({});
            toggleSideForm(false);
            updatePigeons();
            props.handleSubmit();
        } else {
            const apiError = await response.json();
            setError(apiError);
            if (apiError.fields) {
                for (const [, value] of Object.entries(apiError.fields)) {
                    value.disable = disableErrorByFieldName;
                }
                setFieldErrorData(apiError.fields);
            }
        }
    }

    const prepareFetchData = (pigeon) => {
        let formData;
        let jsonType;
        const headers = new Headers();
        headers.set("Authorization", BEARER + localStorage.getItem(AUTH_TOKEN));

        if (images && images.length > 0) {
            formData = new FormData();
            formData.append("pigeon", new Blob([JSON.stringify(pigeon)], {type: "application/json"}));
            images.forEach(image => formData.append("images", image));
        } else {
            jsonType = "application/json";
            formData = JSON.stringify(pigeon);
        }
        const fetchOptions = {
            method: editMode ? "PUT" : "POST",
            body: formData
        }
        if (jsonType) {
            headers.set("Content-Type", jsonType);
        }
        fetchOptions.headers = headers;
        return {
            url: `${PIGEONS_URL}${pigeonId ? "/" + pigeonId : ""}`,
            options: fetchOptions
        }
    }

    function initFormWith(pigeon) {
        setPigeonId(pigeon.id);
        setRingNumber(pigeon.ringNumber);
        setBirthdate(pigeon.birthdate ? dayjs(pigeon.birthdate) : null);
        setName(pigeon.name);
        setCountryCode(pigeon.countryCode);
        setKeeper({value: pigeon.keeperId, label: pigeon.keeperName});
        setDovecote(sectionsOptions.find(section => section.id === pigeon.sectionId));
        setSex(pigeon.sex.toUpperCase());
        setColor(pigeon.color);
        setCondition(pigeon.condition);
        setFather(pigeon.father);
        setMother(pigeon.mother);
        setMate(pigeon.mate);
        setImages(pigeon.images ? pigeon.images : []);
        setPreviewImages(previewImages => {
            const newPreviews = [];
            pigeon.images && pigeon.images.forEach(image => {
                newPreviews.push({image: URL.createObjectURL(image), fileName: image.name, isMain: false})
            })
            return [...previewImages, ...newPreviews]
        });

        setInitialized(true);
    }

    useEffect(() => {
        fetch(MAIN_KEEPER_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => {
                json.label = json.name;
                setKeeper(json);
                setMainKeeper(json);
            });
        updatePigeons();
        updateSectionsOptions()
        if (!props.keeperOptions) {
            fetch(KEEPER_URL, {
                headers: {
                    "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
                }
            })
                .then(res => res.json())
                .then(json => setKeeperOptions(makeOptions(json)))
        }
        fatherData.sectionsOptions = sectionsOptions;
        setSex("MALE");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (sectionsOptions.length > 0 && editMode && !initialized) {
            initFormWith(props.pigeon);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionsOptions])

    const toggleSideForm = (openState) => {
        setOpen(openState);
    }

    const updateKeeperOptions = () => {
        fetch(KEEPER_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => props.keeperOptions ? props.setKeeperOptions(makeOptions(json)) : setKeeperOptions(makeOptions(json)))
    }

    const updateSectionsOptions = () => {
        fetch(HIERARCHICAL_SECTIONS_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => setSectionsOptions(flatten(addHierarchicalLabelsTo(json))))
    }

    const updatePigeons = () => {
        fetch(PIGEONS_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(resp => resp.json())
            .then(json => setPigeons(json));
    }

    const disableErrorByFieldName = (fieldName) => {
        setFieldErrorData(prevState => {
            return {...prevState, [fieldName]: null};
        })
    }

    const resetForm = () => {
        setImages([]);
        setPreviewImages([]);

        if (editMode) {
            initFormWith(props.pigeon);
            return;
        }

        setRingNumber("");
        setBirthdate(null);
        setName(null);
        setCountryCode(null);
        setKeeper(mainKeeper);
        setDovecote(null);
        setSex("MALE");
        setColor(null);
        setCondition("HEALTH");
        setFather(null);
        setMother(null);
        setMate(null);

    }

    const closeErrorAlert = () => {
        setError(null);
    }

    useImperativeHandle(ref, () => ({
        toggleSideForm
    }))

    return (
        <SideEditForm open={isOpen} onClose={() => toggleSideForm(false)}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" align="center" gutterBottom>
                    {editMode
                        ? `Голубь ${ringNumber}`
                        : "Новый голубь"}
                </Typography>
                <Divider sx={{marginBottom: "15px"}}>
                    <Chip label="Основные данные" sx={{fontSize: "1.2rem"}}/>
                </Divider>
                <InputText
                    data={ringNumberData}
                    onChange={setRingNumber}
                    error={fieldErrorData.ringNumber}
                    required
                    variant="standard"/>
                <InputDate
                    data={birthdateData}
                    onChange={setBirthdate}
                    error={fieldErrorData.birthdate}
                    slotProps={{textField: {variant: "standard", fullWidth: true}}}/>
                <InputText
                    data={nameData}
                    onChange={setName}
                    error={fieldErrorData.name}
                    variant="standard"/>
                <SelectCommon
                    data={countryCodeData}
                    onChange={setCountryCode}
                    error={fieldErrorData.countryCode}
                    variant={"standard"}
                    // sx={{marginTop: "16px", marginBottom: "8px"}}
                />
                <InputDovecoteAutocompleteCreatable
                    data={dovecoteData}
                    onChange={setDovecote}
                    error={fieldErrorData.section}
                    onSubmit={updateSectionsOptions}
                    variant="standard"/>
                <InputKeeperAutocompleteCreatable
                    data={keeperData}
                    onChange={setKeeper}
                    error={fieldErrorData.keeper}
                    updateKeepers={updateKeeperOptions}
                    variant="standard"/>
                <Divider sx={{marginTop: "30px", marginBottom: "15px"}}>
                    <Chip label="Физ. параметры" sx={{fontSize: "1.2rem"}}/>
                </Divider>
                <ControlledRadioGroup data={sexData} onChange={setSex} disabled={editMode}/>
                <InputColorAutocompleteCreatable
                    data={colorData}
                    onChange={setColor}
                    error={fieldErrorData.color}
                    variant="standard"/>
                <SelectCommon
                    data={conditionData}
                    onChange={setCondition}
                    error={fieldErrorData.condition}
                    withoutAny
                    variant={"standard"}
                    sx={{marginTop: "16px", marginBottom: "8px"}}/>
                <Divider sx={{marginTop: "30px"}}>
                    <Chip label="Связи" sx={{fontSize: "1.2rem"}}/>
                </Divider>
                <InputPigeonAutocomplete
                    data={fatherData}
                    onChange={setFather}
                    error={fieldErrorData.father}
                    variant="standard"/>
                <InputPigeonAutocomplete
                    data={motherData}
                    onChange={setMother}
                    error={fieldErrorData.mother}
                    variant="standard"/>
                <InputPigeonAutocomplete
                    data={mateData}
                    onChange={setMate}
                    error={fieldErrorData.mate}
                    variant="standard"/>
                <Divider sx={{marginTop: "30px"}}>
                    <Chip label="Фото" sx={{fontSize: "1.2rem"}}/>
                </Divider>
                <ImageUpload
                    images={editMode ? props.pigeon.images : undefined}
                    setImages={setImages}
                    setMainImage={setMainImage}
                    previewImages={previewImages}
                    setPreviewImages={setPreviewImages}/>
                <Stack direction="row" spacing={2} mt={6} mb={4} justifyContent="space-between">
                    <ButtonGroup variant="soft">
                        <Tooltip title="Закрыть" variant="soft" arrow placement="top-start">
                            <IconButton onClick={() => setOpen(false)}>
                                <Close sx={{color: "#337ab7"}}/>
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="soft"
                            size="lg"
                            type="button"
                            onClick={resetForm}
                            sx={{color: "#337ab7"}}
                        >
                            {editMode ? "Восстановить" : "Очистить"}
                        </Button>
                    </ButtonGroup>
                    <Button
                        variant="solid"
                        size="lg"
                        type="submit"
                        sx={{backgroundColor: "#337ab7"}}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </form>
            {error && <ErrorSnackbar message={error.message} onClose={closeErrorAlert}/>}
        </SideEditForm>
    );
};

export default forwardRef(PigeonSideEditForm);