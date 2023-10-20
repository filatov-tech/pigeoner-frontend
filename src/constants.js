export const FlightTypes = {
    CUP: "Кубковое соревнование",
    COMPETITION: "Соревнование",
    TRAINING: "Тренировка",
    JUNIOR_COMPETITION: "Юниорское соревнование"
}

export const AfterFlightCondition = {
    NORMAL: "Нормальное",
    TIRED: "Уставший"
}

export const Sex = {
    MALE: "самец",
    FEMALE: "самка"
}
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ? process.env.REACT_APP_BASE_API_URL : "";
export const PIGEONS_URL = BASE_API_URL + '/api/v1/pigeons';
export const COLOR_URL = BASE_API_URL + "/api/v1/color"
export const FLIGHTS_URL = BASE_API_URL + "/api/v1/flights";
export const KEEPER_URL = BASE_API_URL + '/api/v1/keepers';
export const MAIN_KEEPER_URL = KEEPER_URL + '/main';
export const LAUNCH_POINTS_URL = BASE_API_URL + "/api/v1/launch-point";
export const HIERARCHICAL_SECTIONS_URL = BASE_API_URL + "/api/v1/sections/hierarchical";
export const SECTIONS_URL = BASE_API_URL + "/api/v1/sections";
export const HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL = SECTIONS_URL + "/hierarchical-with-pigeons";
export const DOVECOTE_WITH_SECTIONS_HIERARCHY_URL = BASE_API_URL + '/api/v1/sections/hierarchy';

