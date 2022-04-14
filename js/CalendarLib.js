/** @Version 0.3
 *  CalendarLib.js
 *  TODO 1. 오늘을 기점으로 이전일을 누를 수 없게 하는 기능
 *       2. 시작일과 종료일을 지정할 수 있는 기능 */
class CalendarLib {
    target = null;
    config = null;
    date = new Date();
    currentDate = null;

    config = {

        clickEvent: true, /* Calendar 클릭시 닫힐 것인지*/
        double: false,  /* 날짜를 시작일과 종료일로 선택여부*/
        format: 'YYYY-mm-dd', /* 데이터를 반환할 때의 날짜 형식 */
    }

    /** @Constructor
     *  @Param : Dom(Element - input), config(Style Object)
     *  Load CSS and Create HTML Element */
    constructor(target) {
        if (!Boolean(target)) throw new Error('wrong parameter');
        if (target.tagName !== 'INPUT') throw new Error('wrong parameter');

        this.target = target;

        this.target.style.textAlign = 'center';
        this.create();
    }

    /** @Param : Object
     *  Calendar Style(Load Css)*/
    style(styleObject) {
        if (!Boolean(styleObject)) throw new Error('wrong parameter');
        if (!(typeof styleObject === 'object')) throw new Error('wrong parameter');

        /* TODO CSS 변경할 수 있도록 */
    }

    /** @Param : Date
     *  Create Calendar Box */
    create() {
        /* create div */
        const box = document.createElement('div');

        box.id = 'calendarBox';
        box.style.position = 'absolute';
        box.classList.add('none');
        box.style.width = '300px';
        box.style.height = '330px';
        box.style.zIndex = 1;
        box.style.boxShadow = '0px 3px 10px 0 rgb(0 0 0 / 7%)';
        box.style.backgroundColor = '#FFFFFF';

        box.innerHTML = `<div class='header'>
                             <a class="prev arrow" data-arrow="PREV"></a>
                             <div>
                                 <span class="month">${CalendarLib.getMonth(this.date.getMonth() + 1)},</span>&nbsp;<span class="year">${this.date.getFullYear()}</span>
                             </div>             
                             <a class="next arrow" data-arrow="NEXT"></a>
                         </div>
                         <table class="list">
                         
                            <colgroup>
                                <col width="14%"></col>
                                <col width="14%"></col>
                                <col width="14%"></col>
                                <col width="14%"></col>
                                <col width="14%"></col>
                                <col width="14%"></col>
                                <col width="14%"></col>
                            </colgroup>
                             <thead>
                             <tr>
                                 <th class="weekend holiday">Sun</th>
                                 <th class="weekend">Mon</th>
                                 <th class="weekend">Tue</th>
                                 <th class="weekend">Wed</th>
                                 <th class="weekend">Thu</th>
                                 <th class="weekend">Fri</th>
                                 <th class="weekend">Sat</th>
                             </tr>
                             </thead>
                             <tbody id="calendar-table"></tbody>
                         </table>`;

        this.target.after(box);

        this.make();
    }

    /** Make Calendar */
    make() {
        const firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1); // 현재달의 첫째날
        const lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0); // 현재달의 마지막날
        const calendar = document.getElementById('calendar-table'); // 리스트를 뿌릴 테이블

        let tableStr = '<tr>';

        /* 1일 시작 위치 */
        for (let i = 0; i < firstDay.getDay(); i++) {
            tableStr += '<td></td>';
        }

        /* 테이블 리스트 출력 */
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = (i < 10) ? `0${i}` : i;
            const currentTime = new Date(this.date.getFullYear(), this.date.getMonth(), i).getDay();
            tableStr += `<td class="cell" value="${day}"><span>${day}</span></td>`;

            /* 개행 */
            if (currentTime === 6) tableStr += '</tr>';
        }

        calendar.innerHTML = tableStr;

        this.eventBind();
    }

    /** @Param : event, Function
     *  @Event
     *  Open Calendar*/
    open(event, callback) {
        if (this.target === null) throw new Error('wrong parameter_TargetException');
        const target = document.getElementById('calendarBox');
        target.classList.toggle('none');

        /* Return Date */
        if (typeof callback === 'function') callback(this.getDate(this.config.format));
    }

    /** @Return String
     *  Get Date(Value) */
    getDate(format) {
        if (!Boolean(format)) throw new Error('wrong parameter')
        return CalendarLib.dateFormat(this.currentDate, format);
    }

    /** @Param : Date
     *  Set Date */
    setDate(date) {
        if (!Boolean(date)) throw new Error('No Parameter');
        if (!(typeof date === 'object')) throw new Error('wrong parameter');
        this.currentDate = date;

        this.setInputValue();
    }

    /** value in Input Tag*/
    setInputValue() {
        this.target.value = this.getDate(this.config.format);
    }

    /** Define Event
     * @Event */
    eventBind(month, date) {
        const arrow = document.getElementsByClassName('arrow');
        const cells = document.getElementsByClassName('cell');

        /** @Event Calendar Open Input Click */
        if (this.config.clickEvent) {
            this.target.addEventListener('click', () => {
                this.open();
            });
        }

        /** @Event Arrow Click */
        for (let item of arrow) {
            item.addEventListener('click', (event) => {
                const dataArrow = event.currentTarget.getAttribute('data-arrow');

                if ('NEXT' === dataArrow) this.date.setMonth(this.date.getMonth() + 1);
                else this.date.setMonth(this.date.getMonth() - 1);
                /* TODO INPUT value에 있는 cell에 check 클래스 적용 */

                this.remove();
                this.create();

                if (this.currentDate !== null) {
                    const year = this.currentDate.getFullYear();
                    const month = this.currentDate.getMonth() + 1;
                    const day = this.currentDate.getDate();

                    for (let cell of cells) {
                        if (Number(cell.getAttribute('value')) === day) {
                            console.log(cell);
                            cell.classList.add('check');
                            break;
                        }
                    }
                }

                document.getElementById('calendarBox').classList.remove('none');
            });
        }

        /** @Event Cell Click*/
        for (let cell of cells) {
            cell.addEventListener('click', (event) => {
                const tdCell = event.currentTarget.getAttribute('value');

                for (let cell of cells) {
                    cell.classList.remove('check');
                }

                cell.classList.toggle('check');

                this.currentDate = new Date(this.date.getFullYear(), this.date.getMonth(), tdCell);
                this.setDate(this.currentDate);
                this.hide();
            });
        }

        /** @Event Outer Layer Click*/
        document.addEventListener('mouseup', (event) => {
            const calenderBox = document.getElementById('calendarBox');
            const containCondition = calenderBox.contains(event.target);

            if (!containCondition) this.hide();
        });
    }

    /** 다시 만들기 위해서 Dom Element Remove */
    remove() {
        const calenderBox = document.getElementById('calendarBox');

        if (calenderBox !== null) calenderBox.remove();
    }

    /** Hide */
    hide() {
        const calenderBox = document.getElementById('calendarBox');
        if (calenderBox !== null) calenderBox.classList.add('none');
    }

    /*********************
     *      Static
     ********************/

    /** @Param : Date, String(TIME FORMAT)
     *  @Static
     *  @Return : Date
     *  Specific Date Format */
    static dateFormat(date, format) {
        /* Falsy Value Check */
        if (!Boolean(date)) throw new Error('No Parameter');

        const year = date.getFullYear();
        let month = (date.getMonth() + 1);
        let day = date.getDate();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

        format = format.toUpperCase();

        switch (format) {
            case 'YYYY-MM-DD':
                date = `${year}-${month}-${day}`;
                break;
            case 'YYYY MM DD':
                date = `${year} ${month} ${day}`;
                break;
            case 'YYYY.MM.DD':
                date = `${year}.${month}.${day}`;
                break;
            case 'YYYY/MM/DD':
                date = `${year}/${month}/${day}`;
                break;
            case 'DD-MM-YYYY':
                date = `${day}-${month}-${year}`;
                break;
            case 'DD.MM.YYYY':
                date = `${day}.${month}.${year}`;
                break;
            case 'DD MM YYYY':
                date = `${year} ${month} ${day}`;
                break;
            case 'DD/MM/YYYY':
                date = `${year}/${month}/${day}`;
                break;
            case 'MM-DD':
                date = `${month}-${day}`;
                break;
            case 'MM/DD':
                date = `${month}/${day}`;
                break;
            case 'MM.DD':
                date = `${month}.${day}`;
                break;
            case 'MM DD':
                date = `${month} ${day}`;
                break;
        }
        return date;
    }

    /** 요일 반환 Method
     *  @Return : string
     *  @Param : Number */
    static getDay(day) {
        const WEEKEND = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        return WEEKEND[day];
    }

    /** 월 반환
     *  @Param : Number
     *  @Return : string */
    static getMonth(month) {
        const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return MONTH[month - 1];
    }

    /** @Param : HTML Element
     *  @Static
     *  Set Style to Input Tag */
    static inputStyle(target) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = `.datepicker{
                                    background: url("../resources/icon-calendar.svg") no-repeat right 0.75rem top 50%;
                                    background-size: 26px auto;
                                    height : 30px;
                                    width: 250px;
                                    display: block;
                                }`
        document.getElementsByTagName('head')[0].appendChild(styleSheet);
        target.setAttribute('readonly', true);
        target.classList.add('datepicker');
    }
}