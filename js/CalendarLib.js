/** @Version 0.4
 *  CalendarLib.js
 *  TODO 1. 오늘을 기점으로 이전일을 누를 수 없게 하는 기능
 *       2. 시작일과 종료일을 지정할 수 있는 기능
 *       3. errorhandler를 사용한 error 처리
 *       4. 디자인 변경 가능하도록 개발*/
class CalendarLib {

    config = {
        el: null, /* Input 태그 위치*/
        style: null, /* CalendarLib 적용할 Css */ // TODO
        prev: true, /* 이전 날짜가 클릭할 수 있는지 여부 */ // TODO
        clickEvent: true, /* Calendar 클릭시 닫힐 것인지*/ // TODO
        duration: false,  /* 날짜를 시작일과 종료일로 선택여부*/ // TODO
        format: 'YYYY-mm-dd', /* 데이터를 반환할 때의 날짜 형식 */
        _date: new Date(), /* 달력 이동을 위한 객체*/
        _currentDate: new Date(), /* Input 태그에 반환할 객체 */
        error: null, /* ErrorHandler */ // TODO
        success: null, /* 데이터 반환시 발생하는 Callback*/
    }

    /** @Constructor
     *  @Param : Dom(Element - input), config(Style Object)
     *  Load CSS and Create HTML Element */
    constructor(config) {
        if(typeof config !== 'object') this.handler('error', '잘못된 파라미터입니다.');

        /* 객체 병합*/
        Object.assign(this.config, config);
        
        if(this.config.style !== null) this.config.el.style.textAlign = 'center';

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
        this.month = CalendarLib.getMonth(this.config._date.getMonth() + 1);
        this.year = this.config._date.getFullYear();

        box.id = 'calendarBox';
        box.style.position = 'absolute';
        box.classList.add('none');
        box.style.width = '300px';
        box.style.height = '340px';
        box.style.zIndex = 1;
        box.style.boxShadow = '0px 3px 10px 0 rgb(0 0 0 / 7%)';
        box.style.backgroundColor = '#FFFFFF';

        box.innerHTML = `<div class='header'>
                             <a class="prev arrow" data-arrow="PREV"></a>
                             <div>
                                 <span class="month">${this.month},</span>&nbsp;<span class="year">${this.year}</span>
                             </div>             
                             <a class="next arrow" data-arrow="NEXT"></a>
                         </div>
                         <table class="list">
                         
                            <colgroup>
                                <col style="border 1px solid black" width="14%"></col>
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

        this.config.el.after(box);

        this.make();
    }

    /** Make Calendar */
    make() {
        const firstDay = new Date(this.config._date.getFullYear(), this.config._date.getMonth(), 1); // 현재달의 첫째날
        const lastDay = new Date(this.config._date.getFullYear(), this.config._date.getMonth() + 1, 0); // 현재달의 마지막날
        const calendar = document.getElementById('calendar-table'); // 리스트를 뿌릴 테이블

        let tableStr = '<tr>';

        /* 1일 시작 위치 */
        for (let i = 0; i < firstDay.getDay(); i++) {
            tableStr += '<td></td>';
        }

        /* 테이블 리스트 출력 */
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = (i < 10) ? `0${i}` : i;
            const currentTime = new Date(this.config._date.getFullYear(), this.config._date.getMonth(), i).getDay();
            let classStr = 'cell';

            const currentMonth = this.config._currentDate.getMonth();

            if (!this.config.prev && (i < this.config._currentDate.getDate)) {
                classStr += ' prev'
            }

            tableStr += `<td class="${classStr}" value="${day}"><span>${day}</span></td>`;


            /* 개행 */
            if (currentTime === 6) tableStr += '</tr>';
        }

        calendar.innerHTML = tableStr;

        this.eventBind();
    }

    /** @Param : event, Function
     *  @Event
     *  Open Calendar*/
    open() {
        const target = document.getElementById('calendarBox');
        target.classList.toggle('none');

        if(!target.classList.contains('none')) target.classList.remove('none-click');
    }

    /** @Return String
     *  Get Date(Value) */
    getDate(format) {
        return CalendarLib.dateFormat(this.config._currentDate, format);
    }

    /** @Param : Date
     *  Set Date */
    setDate(date) {
        if (!Boolean(date)) throw new Error('No Parameter');
        if (!(typeof date === 'object')) throw new Error('wrong parameter');
        this.config._currentDate = date;

        this.setInputValue();
    }

    /** value in Input Tag*/
    setInputValue() {
        this.config.el.value = this.getDate(this.config.format);
    }

    /** Define Event
     * @Event */
    eventBind(month, date) {
        const arrow = document.getElementsByClassName('arrow');
        const cells = document.getElementsByClassName('cell');

        /** @Event Calendar Open Input Click */
        if (this.config.clickEvent) {
            this.config.el.addEventListener('click', () => {
                this.open();
                this.handler('open', 'Open Popup');
            });
        }

        /** @Event Arrow Click */
        for (let item of arrow) {
            item.addEventListener('click', (event) => {
                const dataArrow = event.currentTarget.getAttribute('data-arrow');

                if ('NEXT' === dataArrow) this.config._date.setMonth(this.config._date.getMonth() + 1);
                else this.config._date.setMonth(this.config._date.getMonth() - 1);

                this.remove();
                this.create();

                if (this.config._currentDate !== null) {
                    const year = this.config._currentDate.getFullYear();
                    const month = CalendarLib.getMonth(this.config._currentDate.getMonth() + 1);
                    const day = this.config._currentDate.getDate();

                    for (let cell of cells) {
                        if (Number(cell.getAttribute('value')) === day && month === this.month && this.year === year) {
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

                this.config._currentDate = new Date(this.config._date.getFullYear(), this.config._date.getMonth(), tdCell);
                this.setDate(this.config._currentDate);

                this.hide();
                this.handler('success');
            });
        }

        /** @Event Outer Layer Click*/
        document.addEventListener('mouseup', (event) => {
            const calenderBox = document.getElementById('calendarBox');
            let containCondition = calenderBox.contains(event.target);

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
        if (calenderBox !== null) {
            calenderBox.classList.add('none');
            calenderBox.classList.add('none-click');
        }
    }

    /*********************
     *      Static
     ********************/

    /** @Param : Date, String(TIME FORMAT)
     *  @Static
     *  @Return : Date
     *  Specific Date Format */
    static dateFormat(date, format) {
        if (!Boolean(date)) return null;
        if (!Boolean(format)) return null;

        /* Falsy Value Check */
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

    /*********************
     *      Handler
     ********************/

    /** Callback을 관리하는 Method
     *  @Param : String, String*/
    handler(method, msg) {
        switch (method) {
            case 'error':
                try {
                    if (typeof this.config.error === 'function') this.config.error(msg);
                    else throw new Error(msg);
                }catch (e) {
                    console.error(e);
                }
                break;
            case 'success':
                if(typeof this.config.success === 'function') this.config.success(this.getDate(this.config.format));
                break;
        }
    }
}