import React, {useEffect, useRef, useState} from 'react';
import InputText from "../input/InputText";
import SelectCommon from "../input/SelectCommon";
import '../../../styles/pigeons-filter.css';
import ButtonWithPigeons from "../button/ButtonWithPigeons";
import {outlinedInputClasses} from "@mui/material/OutlinedInput";
import AgeSlider from "../input/AgeSlider";

const PigeonFilterForm = ({submit}) => {
    const filterForm = useRef();

    const [ringNumber, setRingNumber] = useState('');
    const [condition, setCondition] = useState('');
    const [dovecote, setDovecote] = useState('');
    const [name, setName] = useState('');
    const [birthdateFrom, setBirthdateFrom] = useState(null);
    const [birthdateTo, setBirthdateTo] = useState(null);
    const [ageYearFrom, setAgeYearFrom] = useState(0);
    const [ageMonthFrom, setAgeMonthFrom] = useState(0);
    const [ageYearTo, setAgeYearTo] = useState(9);
    const [ageMonthTo, setAgeMonthTo] = useState(11);
    // const [, set] = useState();

    const filtersMap = new Map();
    filtersMap.set("ringNumber", setRingNumber);
    filtersMap.set("condition", setCondition);
    filtersMap.set("dovecote", setDovecote);
    filtersMap.set("name", setName);
    filtersMap.set("birthdateFrom", setBirthdateFrom);
    filtersMap.set("birthdateTo", setBirthdateTo);
    filtersMap.set("ageYearFrom", setAgeYearFrom);
    filtersMap.set("ageMonthFrom", setAgeMonthFrom);
    filtersMap.set("ageYearTo", setAgeYearTo);
    filtersMap.set("ageMonthTo", setAgeMonthTo);
    // filtersMap.set("", );

    const conditionOptions = [
        {value: "Здоров", label: "Здоров"},
        {value: "Болен", label: "Болен"},
        {value: "Потерян", label: "Потерян"},
        {value: "Умер", label: "Умер"},
    ];

    const [sectionOptions, setSectionOptions] = useState([]);

    const ringNumberFilter = new FilterData("ringNumber", ringNumber, "Номер кольца", "Введите номер кольца");
    const conditionFilter = new FilterData("condition", condition, "Состояние", "Состояние птицы", conditionOptions);
    const nameFilter = new FilterData("name", name, "Кличка", "Кличка, если есть");
    const dovecoteFilter = new FilterData("dovecote", dovecote, "Голубятня", "Выберите голубятню", sectionOptions);
    const birthdateFromFilter = new FilterData("birthdateFrom", birthdateFrom, "Дата рождения: ОТ");
    const birthdateToFilter = new FilterData("birthdateTo", birthdateTo, "ДО");
    const ageYearFromFilter = new FilterData("ageYearFrom", ageYearFrom, "Возраст ОТ", "...лет");
    const ageMonthFromFilter = new FilterData("ageMonthFrom", ageMonthFrom, "", "...мес.");
    const ageYearToFilter = new FilterData("ageYearTo", ageYearTo, "ДО", "...лет");
    const ageMonthToFilter = new FilterData("ageMonthTo", ageMonthTo, "", "...мес.");

    const handleSubmit = () => {
        const formDataQuery = new URLSearchParams(new FormData(filterForm.current)).toString();
        submit(formDataQuery);
    }

    const handleChange = (data) => {
        const updateFilterState = filtersMap.get(data.name);
        updateFilterState(data.value);
    };

    const handleGroupChange = (data) => {
        data.forEach(filterState => handleChange(filterState));
    }

    const resetFilters = () => {
        setRingNumber('');
        setCondition('');
        setDovecote('');
        setName('');
        setBirthdateFrom(null);
        setBirthdateTo(null);
        setAgeYearFrom(0);
        setAgeMonthFrom(0);
        setAgeYearTo(1);
        setAgeMonthTo(0);
        submit();
    }

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

    function makeHierarchicalView(data) {
        if (data.length === 0) return [];

        const rootLevel = '';
        let optionsForDovecoteFilter = [];
        data.forEach(section => {
            addSectionOption(section, rootLevel, optionsForDovecoteFilter)
        })
        return optionsForDovecoteFilter;
    }

    const prefixElement = '\xa0\xa0\u23B9\xa0\xa0\xa0';
    function addSectionOption(hierarchicalObject, levelPrefix, sectionList) {
        sectionList.push({value: hierarchicalObject.id, label: `${levelPrefix} ${hierarchicalObject.name}`});

        if (hierarchicalObject.children.length === 0) return;

        const nextLevelPrefix = levelPrefix + prefixElement;
        hierarchicalObject.children.forEach(childSection => {
            addSectionOption(childSection, nextLevelPrefix, sectionList);
        })
    }

    const DOVECOTE_WITH_SECTIONS_HIERARCHY_URL = 'http://localhost:8080/api/v1/sections/hierarchy';
    useEffect(()=>{
        fetch(DOVECOTE_WITH_SECTIONS_HIERARCHY_URL)
            .then(res => res.json())
            .then(json => setSectionOptions(makeHierarchicalView(json)))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <form ref={filterForm} id="pigeon-filter">
            <div className="pigeons-filters">
                <div className="ring">
                    <InputText filterData={ringNumberFilter} onChange={handleChange}/></div>
                <div className="condition">
                    <SelectCommon filterData={conditionFilter} onChange={handleChange}/></div>
                <div className="dovecote">
                    {sectionOptions && <SelectCommon filterData={dovecoteFilter} onChange={handleChange}/>}</div>
                <div className="name"><InputText filterData={nameFilter} /></div>
                <div className="date-filters">
                    <AgeSlider filterData={{value: [ageYearFrom, ageMonthFrom, ageYearTo, ageMonthTo]}} onChange={handleGroupChange}/>
                    {/*<InputDate filterData={birthdateFromFilter} onChange={handleChange} customStyle={customMuiStyle(startGroupElement)}/>*/}
                    {/*<InputDate filterData={birthdateToFilter} onChange={handleChange} customStyle={customMuiStyle(endGroupElement)}/>*/}
                </div>
                <div className="age-from">
                    {/*<SelectTwoFields leftFilterData={ageYearFromFilter} rightFilterData={ageMonthFromFilter}/>*/}
                </div>
                <div className="age-to">
                    {/*<SelectTwoFields leftFilterData={ageYearToFilter} rightFilterData={ageMonthToFilter}/>*/}
                </div>
                <div className="submit-button">
                    <button id="filter" onClick={handleSubmit}
                            className="btn btn-primary btn-lg"
                            type="button" style={{background: "rgb(51,122,183)", width: 150 + "px"}}>
                        Найти
                    </button>
                    <button className="btn btn-light btn-lg reset-button" type="reset" onClick={resetFilters}>Сбросить</button>
                </div>
                <div className="new-pigeon-button">
                    <ButtonWithPigeons/>
                </div>
            </div>
        </form>
    );
};

function FilterData(name, value, label, placeholder, options) {
    this.name = name;
    this.value = value;
    this.label = label;
    this.placeholder = placeholder;
    this.options = options;
}

export default PigeonFilterForm;
