import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import InputText from "../input/InputText";
import SelectCommon from "../input/SelectCommon";
import '../../../styles/pigeons-filter.css';
import {outlinedInputClasses} from "@mui/material/OutlinedInput";
import AgeSlider from "../input/AgeSlider";
import InputDate from "../input/InputDate";
import {MAIN_KEEPER_URL} from "../../../pages/pigeons";
import {makeHierarchicalViewOf} from "../../../util/section-options-builder";

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

    const filtersMap = new Map();
    filtersMap.set("ringNumber", setRingNumber);
    filtersMap.set("condition", setCondition);
    filtersMap.set("dovecote", setDovecote);
    filtersMap.set("name", setName);
    filtersMap.set("dateFilterType", setDateFilterType);
    filtersMap.set("birthdateFrom", setBirthdateFrom);
    filtersMap.set("birthdateTo", setBirthdateTo);
    filtersMap.set("ageYearFrom", setAgeYearFrom);
    filtersMap.set("ageMonthFrom", setAgeMonthFrom);
    filtersMap.set("ageYearTo", setAgeYearTo);
    filtersMap.set("ageMonthTo", setAgeMonthTo);
    filtersMap.set("yearFrom", setYearFrom);
    filtersMap.set("yearTo", setYearTo);
    filtersMap.set("keeper", setKeeper);
    filtersMap.set("sex", setSex);
    filtersMap.set("mate", setHasMate);
    // filtersMap.set("", );

    const conditionOptions = [
        {value: "Здоров", label: "Здоров"},
        {value: "Болен", label: "Болен"},
        {value: "Потерян", label: "Потерян"},
        {value: "Умер", label: "Умер"},
    ];

    const filterTypeOptions = [
        {value: YEAR_TYPE, label: "Год рождения"},
        {value: DATE_TYPE, label: "Дата рождения"},
        {value: AGE_TYPE, label: "Возраст"}
    ]

    const sexOptions = [
        {value: "male", label: "Самец"},
        {value: "female", label: "Самка"}
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

    const handleChange = (data) => {
        const updateFilterState = filtersMap.get(data.name);
        updateFilterState(data.value);
    };

    const handleGroupChange = (data) => {
        data.forEach(filterState => handleChange(filterState));
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

    const DOVECOTE_WITH_SECTIONS_HIERARCHY_URL = '/api/v1/sections/hierarchy';

    useEffect(()=>{
        fetch(DOVECOTE_WITH_SECTIONS_HIERARCHY_URL)
            .then(res => res.json())
            .then(json => setSectionOptions(makeHierarchicalViewOf(json)));
        fetch(MAIN_KEEPER_URL)
            .then(res => res.json())
            .then(json => {
                setMainKeeper(json.id);
                setKeeper(json.id);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <form ref={filterForm} id="pigeon-filter">
            <div className="pigeons-filters">
                <div className="ring">
                    <InputText data={ringNumberFilter} onChange={handleChange}/></div>
                <div className="condition">
                    <SelectCommon data={conditionFilter} onChange={handleChange}/></div>
                <div className="dovecote">
                    {sectionOptions && <SelectCommon data={dovecoteFilter} onChange={handleChange}/>}</div>
                <div className="name"><InputText data={nameFilter} /></div>
                <div className="date-filters">
                    <div className="date-filters-item" style={{width: '30%', flexGrow: 0}}>
                        <SelectCommon data={dateFilterTypeSelect} onChange={handleChange}
                                      customStyle={customMuiStyle(
                                          dateFilterType === AGE_TYPE ? {} : startGroupElement)} withoutAny/>
                    </div>
                    {dateFilterType === YEAR_TYPE &&
                        <>
                            <div className="date-filters-item">
                                <InputDate data={yearFromFilter} onChange={handleChange}
                                           customStyle={customMuiStyle(middleGroupElement)}
                                           onlyYear/>
                            </div>
                            <div className="date-filters-item">
                                <InputDate data={yearToFilter} onChange={handleChange}
                                           customStyle={customMuiStyle(endGroupElement)} onlyYear/>
                            </div>
                        </>

                    }
                    {dateFilterType === DATE_TYPE &&
                        <>
                            <div className="date-filters-item">
                                <InputDate data={birthdateFromFilter}
                                           onChange={handleChange}
                                           customStyle={customMuiStyle(middleGroupElement)}/>
                            </div>
                            <div className="date-filters-item">
                                <InputDate data={birthdateToFilter}
                                           onChange={handleChange}
                                           customStyle={customMuiStyle(endGroupElement)}/>
                            </div>
                        </>
                    }
                    {dateFilterType === AGE_TYPE &&
                        <div className="date-filters-item" style={{alignSelf: "flex-end"}}>
                            <AgeSlider data={{value: [ageYearFrom, ageMonthFrom, ageYearTo, ageMonthTo]}}
                                       onChange={handleGroupChange}/>
                        </div>
                    }
                </div>
                <div className="other-filters">
                    <div className="other-filters-item">
                        <SelectCommon data={keeperFilter} onChange={handleChange}/>
                    </div>
                    <div className="other-filters-item">
                        <SelectCommon data={sexFilter} onChange={handleChange}/>
                    </div>
                    <div className="other-filters-item">
                        <SelectCommon data={mateFilter} onChange={handleChange}/>
                    </div>
                </div>
            </div>
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
