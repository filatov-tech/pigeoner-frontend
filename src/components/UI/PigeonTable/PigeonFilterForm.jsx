import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import InputText from "../input/InputText";
import SelectCommon from "../input/SelectCommon";
import '../../../styles/pigeons-filter.css';
import {outlinedInputClasses} from "@mui/material/OutlinedInput";
import AgeSlider from "../input/AgeSlider";
import InputDate from "../input/InputDate";
import {AUTH_TOKEN, BEARER, DOVECOTE_WITH_SECTIONS_HIERARCHY_URL, MAIN_KEEPER_URL} from "../../../constants";
import {makeHierarchicalViewOf} from "../../../util/section-options-builder";
import Grid from "@mui/material/Unstable_Grid2";

const PigeonFilterForm = forwardRef((props, ref) => {
    const filterForm = useRef();
    const YEAR_TYPE= "yearType";
    const DATE_TYPE= "dateType";
    const AGE_TYPE= "ageType";
    const YEAR_MAX = 9;
    const MONTH_MAX = 11;
    const EMPTY_STRING = '';
    const ZERO = 0;

    const [ringNumber, setRingNumber] = useState(EMPTY_STRING);
    const [condition, setCondition] = useState(EMPTY_STRING);
    const [dovecote, setDovecote] = useState(EMPTY_STRING);
    const [name, setName] = useState(EMPTY_STRING);
    const [dateFilterType, setDateFilterType] = useState(YEAR_TYPE);
    const [birthdateFrom, setBirthdateFrom] = useState(null);
    const [birthdateTo, setBirthdateTo] = useState(null);
    const [ageYearFrom, setAgeYearFrom] = useState(ZERO);
    const [ageMonthFrom, setAgeMonthFrom] = useState(ZERO);
    const [ageYearTo, setAgeYearTo] = useState(YEAR_MAX);
    const [ageMonthTo, setAgeMonthTo] = useState(MONTH_MAX);
    const [yearFrom, setYearFrom] = useState(null);
    const [yearTo, setYearTo] = useState(null);
    const [mainKeeper, setMainKeeper] = useState(EMPTY_STRING);
    const [keeper, setKeeper] = useState(EMPTY_STRING);
    const [sex, setSex] = useState(EMPTY_STRING);
    const [hasMate, setHasMate] = useState(EMPTY_STRING);
    // const [, set] = useState();

    const state = {
        ringNumber: ringNumber,
        condition: condition,
        dovecote: dovecote,
        name: name,
        dateFilterType: dateFilterType,
        keeper: keeper,
        sex: sex,
        hasMate: hasMate
}

    const yearTypeState = {
        yearFrom: yearFrom,
        yearTo: yearTo
    }

    const dateTypeState = {
        birthdateFrom: birthdateFrom,
        birthdateTo: birthdateTo
    }

    const ageTypeState = {
        ageYearFrom: ageYearFrom,
        ageMonthFrom: ageMonthFrom,
        ageYearTo: ageYearTo,
        ageMonthTo: ageMonthTo,
    }

    const conditionOptions = [
        {value: "HEALTH", label: "Здоров"},
        {value: "DISEASED", label: "Болен"},
        {value: "LOST", label: "Потерян"},
        {value: "DEAD", label: "Умер"},
    ];

    const filterTypeOptions = [
        {value: YEAR_TYPE, label: "Год рождения"},
        {value: DATE_TYPE, label: "Дата рождения"},
        {value: AGE_TYPE, label: "Возраст"}
    ]

    const sexOptions = [
        {value: "MALE", label: "Самец"},
        {value: "FEMALE", label: "Самка"}
    ]

    const hasMateOptions = [
        {value: true, label: "Есть пара"},
        {value: false, label: "Нет пары"}
    ]

    const [sectionOptions, setSectionOptions] = useState([]);
    // const [keeperOptions, setKeeperOptions] = useState([]);

    const ringNumberFilter = new InputFieldData("ringNumber", ringNumber, "Номер кольца", "Введите номер кольца");
    const conditionFilter = new InputFieldData("condition", condition, "Состояние", "Состояние птицы", conditionOptions);
    const nameFilter = new InputFieldData("name", name, "Кличка", "Кличка, если есть");
    const dovecoteFilter = new InputFieldData("dovecote", dovecote, "Голубятня", "Выберите голубятню", sectionOptions);
    const dateFilterTypeSelect = new InputFieldData("dateFilterType", dateFilterType, "Тип даты", "", filterTypeOptions);
    const birthdateFromFilter = new InputFieldData("birthdateFrom", birthdateFrom, "От");
    const birthdateToFilter = new InputFieldData("birthdateTo", birthdateTo, "До");
    const yearFromFilter = new InputFieldData("yearFrom", yearFrom, "от (год)");
    const yearToFilter = new InputFieldData("yearTo", yearTo, "до (год)");
    const keeperFilter = new InputFieldData("keeper", keeper, "Владелец", "", props.keeperOptions);
    const sexFilter = new InputFieldData("sex", sex, "Пол", "", sexOptions);
    const mateFilter = new InputFieldData("mate", hasMate, "Пара", "", hasMateOptions);

    useImperativeHandle(ref, () => ({
        handleSubmit,
        resetFilters
    }));

    const handleSubmit = () => {
        let sendingData;
        switch (dateFilterType) {
            case YEAR_TYPE:
                sendingData = {...state, ...yearTypeState};
                break;
            case DATE_TYPE:
                sendingData = {...state, ...dateTypeState};
                break;
            case AGE_TYPE:
                sendingData = {...state, ...ageTypeState};
                break;
            default:
                sendingData = {...state};
        }
        props.submitButton(sendingData);
    }

    const onChangeGroup = {
        onAgeYearFromChange: setAgeYearFrom,
        onAgeMonthFromChange: setAgeMonthFrom,
        onAgeYearToChange: setAgeYearTo,
        onAgeMonthToChange: setAgeMonthTo,
    }

    const [needReset, setNeedReset] = useState(false);

    const resetFilters = () => {
        setRingNumber(EMPTY_STRING);
        setCondition(null);
        setDovecote(null);
        setName(EMPTY_STRING);
        setBirthdateFrom(null);
        setBirthdateTo(null);
        setAgeYearFrom(ZERO);
        setAgeMonthFrom(ZERO);
        setAgeYearTo(YEAR_MAX);
        setAgeMonthTo(MONTH_MAX);
        setYearFrom(null);
        setYearTo(null);
        setKeeper(mainKeeper);
        setSex(null);
        setHasMate(null);
        setNeedReset(true);
    }

    useEffect(() => {
        if (needReset) {
            handleSubmit();
            setNeedReset(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needReset])

    let startGroupElement = {
        borderRightColor: "transparent",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    }
    let middleGroupElement = {
        borderRightColor: "transparent",
        borderRadius: 0
    }
    let endGroupElement = {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    }

    const customMuiStyle = (muiStyle) => {
        return ({
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            [`& .${outlinedInputClasses.notchedOutline}`]: muiStyle
                        }
                    }
                }
        })
    }

    useEffect(()=>{
        fetch(DOVECOTE_WITH_SECTIONS_HIERARCHY_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => setSectionOptions(makeHierarchicalViewOf(json)));
        fetch(MAIN_KEEPER_URL, {
            headers: {
                "Authorization": BEARER + localStorage.getItem(AUTH_TOKEN)
            }
        })
            .then(res => res.json())
            .then(json => {
                setMainKeeper(json.id);
                setKeeper(json.id);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <form ref={filterForm}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <InputText data={ringNumberFilter} onChange={setRingNumber} withoutHelperText />
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <SelectCommon data={conditionFilter} onChange={setCondition} withoutHelperText />
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    {sectionOptions && <SelectCommon data={dovecoteFilter} onChange={setDovecote} withoutHelperText />}
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <InputText data={nameFilter} onChange={setName} withoutHelperText />
                </Grid>
                <Grid container xs={12} md={8} lg={6} columns={100} columnSpacing={0}>
                    <Grid xs={30} sx={{paddingX: 0}}>
                        <SelectCommon
                            data={dateFilterTypeSelect}
                            onChange={setDateFilterType}
                            customStyle={customMuiStyle(
                                dateFilterType === AGE_TYPE
                                    ? {}
                                    : startGroupElement)}
                            withoutAny
                            withoutHelperText
                        />
                    </Grid>
                    {dateFilterType === YEAR_TYPE &&
                        <>
                            <Grid xs sx={{paddingX: 0}}>
                                <InputDate
                                    data={yearFromFilter}
                                    onChange={setYearFrom}
                                    customStyle={customMuiStyle(middleGroupElement)}
                                    onlyYear
                                    withoutHelperText
                                />
                            </Grid>
                            <Grid xs sx={{paddingX: 0}}>
                                <InputDate
                                    data={yearToFilter}
                                    onChange={setYearTo}
                                    customStyle={customMuiStyle(endGroupElement)}
                                    onlyYear
                                    withoutHelperText
                                />
                            </Grid>
                        </>
                    }
                    {dateFilterType === DATE_TYPE &&
                        <>
                            <Grid xs sx={{paddingX: 0}}>
                                <InputDate data={birthdateFromFilter}
                                           onChange={setBirthdateFrom}
                                           customStyle={customMuiStyle(middleGroupElement)}
                                           withoutHelperText
                                />
                            </Grid>
                            <Grid xs sx={{paddingX: 0}}>
                                <InputDate data={birthdateToFilter}
                                           onChange={setBirthdateTo}
                                           customStyle={customMuiStyle(endGroupElement)}
                                           withoutHelperText
                                />
                            </Grid>
                        </>
                    }
                    {dateFilterType === AGE_TYPE &&
                        <Grid xs>
                            <AgeSlider data={{value: [ageYearFrom, ageMonthFrom, ageYearTo, ageMonthTo]}}
                                       onChange={onChangeGroup}/>
                        </Grid>
                    }
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={2}>
                    <SelectCommon data={keeperFilter} onChange={setKeeper} withoutHelperText />
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={2}>
                    <SelectCommon data={sexFilter} onChange={setSex} withoutHelperText />
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={2}>
                    <SelectCommon data={mateFilter} onChange={setHasMate} withoutHelperText />
                </Grid>
            </Grid>
        </form>
    );
})

export function InputFieldData(name, value, label, placeholder, options, parameters) {
    this.name = name;
    this.value = value;
    this.label = label;
    this.placeholder = placeholder;
    this.options = options;
    this.parameters = parameters;
}

export default PigeonFilterForm;
