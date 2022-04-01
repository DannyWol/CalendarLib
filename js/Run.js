const inputTag = document.getElementById('calendar');

CalendarLib.inputStyle(inputTag);
const config = {
    width: '260px',
    height: '260px',
    clickEvent: true,
    format: 'YYYY-mm-dd',
};

const calendar = new CalendarLib(inputTag, config);

inputTag.addEventListener('click', (event) => {
    calendar.open(event);
});