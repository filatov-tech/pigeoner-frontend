# Pigeoner - frontend
## О проекте
Данный репозиторий представляет собой клиентскую часть веб-сервиса pigeoner.ru
### Описание
Веб-сервис предлагает спортивным голубиным питомникам удобный и интуитивно понятный инстумент для орагнизации учета голубей и деятельности с ними связанной.
### Основные возможности
<ol>
	<li>Учет голубей. В это входит:
		<ul>
			<li>данные об особи: кличка, номер кольца, дата рождения, окрас, статус, состояние и др.</li>
			<li>связи: родительские и селекционные</li>
			<li>сохранение изображений</li>
			<li>динамично формируемая родословная</li>
			<li>данные о тренировках и соревновательных вылетах</li>
		</ul>
	</li>
	<li>Управление распределением голубей внутри питомника
		<ul>
			<li>полное управление структурой и иерархией голубятен, секций и гнезд</li>
			<li>распределение голубей в созданной структуре питомника</li>
		</ul>
	</li>
	<li>Учет тренировочных и соревновательных вылетов
		<ul>
			<li>создание вылетов различных типов: тренировочные, соревновательные, кубковые и др.</li>
			<li>добавление участников к вылетам</li>
			<li>расчет результирующих показателей по итогам вылетов</li>
			<li>учет состояния птицы после вылета</li>
			<li>поиск и фильтрация по вылетам и участника</li>
		</ul>
	</li>
</ol>

## Архитектура
### Общее устройство сервиса
Приложение разделено на три отдельных компонента, каждый из которых работает в отдельном docker-контейнере. Это:
1. Backend - Spring Boot приложение
2. База данных - PostgreSQL. Сами данные и изображения пользователей хранятся в отдельных томах (volumes).
3. Frontend - React-приложение
### Серверное окружение
Приложение запущено и работает на чстном виртуальном VDS сервере под управлением Ubuntu. С помощью веб-сервера Nginx, который выполняет роль обратного прокси, осуществляется распределение трафика между частями приложения. Здесь же настроена терминация SSL сертификатов.
### Backend-часть
Spring Boot приложение организовано в соответствии с классчиеской трехуровневой архитектурой: клиент-логика-данные. Коммуникация с клиентом реализована с применением REST подхода.
Авторизация и аутентификация организованы с помщью JWT.
## Стэк
<details>
  <summary>Frontend</summary>
  <ul>
    <li>JavaScript/React</li>
    <li>Material UI</li>
    <li>Bootstrap</li>
    <li>HTML/CSS</li>
  </ul>
</details>
<details>
  <summary>Backend</summary>
  <ul>
    <li>Java 17</li>
    <li>Spring: Boot, Security, MVC, Data JPA</li>
    <li>Hibernate</li>
    <li>PostgreSQL</li>
    <li>Maven</li>
    <li>Git</li>
  </ul>
</details>
<details>
  <summary>Deploy</summary>
  <ul>
    <li>Docker</li>
    <li>Ubuntu</li>
    <li>Nginx</li>
    <li>GitHub Actions</li>
  </ul>
</details>
