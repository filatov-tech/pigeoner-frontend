import React, {useRef} from 'react';
import SectionSelect from "../SectionSelect";
import InputText from "../input/InputText";
import SelectCommon from "../input/SelectCommon";
import InputDate from "../input/InputDate";
import SelectTwoFields from "../input/SelectTwoFields";
import '../../../styles/pigeons-filter.css';

const PigeonFilterForm = ({submit}) => {
    const filterForm = useRef();

    const yearOptions = [
        {value: 0, label: "0 лет"},
        {value: 1, label: "1 года"},
        {value: 2, label: "2 лет"},
        {value: 3, label: "3 лет"},
        {value: 4, label: "4 лет"},
        {value: 5, label: "5 лет"},
        {value: 6, label: "6 лет"},
        {value: 7, label: "7 лет"},
        {value: 8, label: "8 лет"},
        {value: 9, label: "9 лет"},
    ];

    const monthOptions = [
        {value: 1, label: "0 мес."},
        {value: 2, label: "1 мес."},
        {value: 3, label: "2 мес."},
        {value: 4, label: "3 мес."},
        {value: 5, label: "4 мес."},
        {value: 6, label: "5 мес."},
        {value: 7, label: "6 мес."},
        {value: 8, label: "7 мес."},
        {value: 9, label: "8 мес."},
        {value: 10, label: "9 мес."},
        {value: 11, label: "10 мес."},
        {value: 12, label: "11 мес."}
    ];

    const conditionOptions = [
        {value: "Здоров", label: "Здоров"},
        {value: "Болен", label: "Болен"},
        {value: "Потерян", label: "Потерян"},
        {value: "Умер", label: "Умер"},
    ];

    const ringNumberFilter = new FilterData("ringNumber", "Кольцо", "Введите номер кольца");
    const conditionFilter = new FilterData("condition", "Состояние", "Состояние птицы", conditionOptions);
    const nameFilter = new FilterData("name", "Кличка", "Кличка, если есть");
    const birthdateFromFilter = new FilterData("birthdateFrom", "Дата рождения: ОТ");
    const birthdateToFilter = new FilterData("birthdateTo", "ДО");
    const ageYearFromFilter = new FilterData("ageYearFrom", "Возраст ОТ", "...лет", yearOptions);
    const ageMonthFromFilter = new FilterData("ageMonthFrom", "", "...мес.", monthOptions);
    const ageYearToFilter = new FilterData("ageYearTo", "ДО", "...лет", yearOptions);
    const ageMonthToFilter = new FilterData("ageMonthTo", "", "...мес.", monthOptions);

    const handleSubmit = () => {
        const formDataQuery = new URLSearchParams(new FormData(filterForm.current)).toString();
        submit(formDataQuery);
    }

    const resetFilters = () => {
        submit();
    }

    return (
        <form ref={filterForm} id="pigeon-filter">
            <div className="pigeons-filters">
                <div className="ring"><InputText filterData={ringNumberFilter} /></div>
                <div className="condition"><SelectCommon filterData={conditionFilter}/></div>
                <div className="dovecote">
                    <label className="form-label" htmlFor="location">
                        <strong>Голубятня</strong>
                    </label>
                    <div id="pigeoner-sections">
                        <SectionSelect/>
                    </div>
                </div>
                <div className="name"><InputText filterData={nameFilter} /></div>
                <div className="year-from"><InputDate filterData={birthdateFromFilter}/></div>
                <div className="year-to"><InputDate filterData={birthdateToFilter}/></div>
                <div className="age-from">
                    <SelectTwoFields leftFilterData={ageYearFromFilter} rightFilterData={ageMonthFromFilter}/>
                </div>
                <div className="age-to">
                    <SelectTwoFields leftFilterData={ageYearToFilter} rightFilterData={ageMonthToFilter}/>
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
                    <button id="create"
                            className="btn btn-primary btn-lg"
                            type="button" style={{background: "rgb(51,122,183)", width: 165 + "px"}}>
                        Новый голубь
                    </button>
                </div>
            </div>
        </form>
    );
};

function FilterData(name, label, placeholder, options) {
    this.name = name;
    this.label = label;
    this.placeholder = placeholder;
    this.options = options;
}

export default PigeonFilterForm;
