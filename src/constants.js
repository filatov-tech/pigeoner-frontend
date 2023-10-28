export const FlightTypes = {
    CUP: "Кубковое соревнование",
    COMPETITION: "Соревнование",
    TRAINING: "Тренировка",
    JUNIOR_COMPETITION: "Юниорское соревнование"
}

export const Condition = {
    HEALTH: "Здоров",
    DISEASED: "Болен",
    DEAD:"Умер",
    LOST:"Потерян",
    UNKNOWN:"Неизвестно"
}

export const AfterFlightCondition = {
    NORMAL: "Нормальное",
    TIRED: "Уставший"
}

export const Sex = {
    MALE: "самец",
    FEMALE: "самка"
}

const PRODUCTION = "production";
export const AUTH_TOKEN = "auth_token"
export const BEARER = "Bearer "

const API_V1 = "/api/v1"
const BASE_API_URL = process.env.NODE_ENV ===  PRODUCTION
    ? "https://pigeoner.ru" + API_V1
    : "http://localhost:8080" + API_V1;

export const PIGEONS_URL = BASE_API_URL + '/pigeons';
export const COLOR_URL = BASE_API_URL + "/color";
export const FLIGHTS_URL = BASE_API_URL + "/flights";
export const KEEPER_URL = BASE_API_URL + '/keepers';
export const MAIN_KEEPER_URL = KEEPER_URL + '/main';
export const LAUNCH_POINTS_URL = BASE_API_URL + "/launch-point";
export const HIERARCHICAL_SECTIONS_URL = BASE_API_URL + "/sections/hierarchical";
export const SECTIONS_URL = BASE_API_URL + "/sections";
export const HIERARCHICAL_SECTIONS_WITH_PIGEONS_URL = SECTIONS_URL + "/hierarchical-with-pigeons";
export const DOVECOTE_WITH_SECTIONS_HIERARCHY_URL = BASE_API_URL + '/sections/hierarchy';
export const LOGIN_URL = BASE_API_URL + "/auth/authenticate";
export const REGISTER_URL = BASE_API_URL + "/auth/register";

