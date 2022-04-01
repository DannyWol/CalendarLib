/** Version 0.0.1
 *  CalendarLib.js
 *      - JS 기본 세팅
 * */
class CalendarLib {
    sym = null;
    target = null;
    config = null;

    /** @Constructor
     *  @Public
     *  @Param : Dom(Element - input), config(Style Object)
     *  Load CSS and Create HTML Element */
    constructor(target, config) {
        if (!Boolean(target)) throw new Error('wrong parameter');
        if (target.tagName !== 'INPUT') throw new Error('wrong parameter');

        this.checkConfig(config);
        const date = new Date();
        this.target = target;

        /* 은닉을 위해 새로운 객체에 Symbol 제외 */
        this.config = {
            width: config.width,
            height: config.height,
            clickEvent: config.clickEvent,
            format: config.format
        }

        config.sym = Symbol('key');
        this.sym = config.sym;

        this.create(date, config.sym);
    }

    /** @Private
     *  @Param : Object
     *  Config Check */
    checkConfig(config) {
        if (!Boolean(config)) throw new Error('wrong parameter (because: config)');
        if (!Boolean(config.width)) throw new Error('wrong parameter (because: width)');
        if (!Boolean(config.height)) throw new Error('wrong parameter (because: height)');
        if (!Boolean(config.clickEvent)) throw new Error('wrong parameter (because: clickEvent)');
        if (!Boolean(config.format)) throw new Error('wrong parameter (because: format)');

        if (typeof config.clickEvent !== 'boolean') throw new Error('wrong parameter (because: clickEvent)');
        if (typeof config.width !== 'string') throw new Error('wrong parameter (because: width)');
        if (typeof config.height !== 'string') throw new Error('wrong parameter (because: height)');
        if (typeof config.format !== 'string') throw new Error('wrong parameter (because: format)');
    }

    /** @Param : Object
     *  @Private
     *  Calendar Style(Load Css)*/
    style(styleObject, config) {
        if (this.config.sym !== this.sym) throw new Error('Use Constructor');
        if (!Boolean(styleObject)) throw new Error('wrong parameter');
        if (!(typeof styleObject === 'object')) throw new Error('wrong parameter');
    }

    /** @Param : Date
     *  @Private
     *  Create Calendar Box */
    create(date, sym) {
        if (sym !== this.sym) throw new Error('Use Constructor');
        /* create div */
        const box = document.createElement('div');

        box.id = 'CalendarBox';
        box.style.border = '1px solid black';
        box.style.position = 'relative';
        box.style.display = 'inline-block'; // TODO none으로 변경
        box.style.width = this.config.width;
        box.style.height = this.config.height;
        box.style.zIndex = 1;

        this.target.after(box);
    }

    /** @Param Object, Event
     *  @Private
     *  @Return : Specific Date
     *  Click  Day*/
    selectDate(config, event) {
        return this.getDate();
    }

    /** @Param : event, Function
     *  @Public
     *  @Event
     *  Open Calendar*/
    open(event, callback) {
        if (this.target === null) throw new Error('wrong parameter_TargetException');
        console.log(this.target);

        /* Return Date */
        if (typeof callback === 'function') callback(this.getDate());
    }

    /** @Event
     *  @Public
     *  @Param : Function
     *  Close Calendar */
    close(callback) {
        if (this.target === null) throw new Error('wrong parameter_TargetException');

        /* Remove Calendar Element */

        /* callback  */
        if (typeof callback === 'function') {}callback(this.getDate());

        /* Remove Property */

    }

    /** @Public
     *  @Event
     *  @Param : Object
     *  Clear Value */
    clear(config) {
    }

    /** @Public
     *  Get Date(Value) */
    getDate(format) {
        if (!Boolean(format)) throw new Error('wrong parameter')
    }

    /** @Public
     *  Set Date */
    setDate(date) {

    }

    /** @Param :String(YEAR OR MONTH OR DAY)
     *  @Event
     *  @Private
     *  Move Calendar */
    move(time) {
        if (this.config.sym !== this.sym) throw new Error('Use Constructor');

        // if (typeof this.date !== 'symbol') throw new Error('잘못된 접근입니다.');
        if (!Boolean(time)) throw new Error('No Parameter');

        time = time.toUpperCase();

        switch (time) {
            case 'YEAR':
                alert('개발 보류');
                break;
            case 'MONTH':

                break;
            case 'DAY':
                break;
        }
    }

    /** @Param : Date, String(TIME FORMAT)
     *  @Static
     *  @Return : Date
     *  Specific Date Format */
    static dateFormat(config, date, format) {
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
            case 'YYYY-MM-DD HH:MM:SS':
                date = `${year}-${month}-${day}`;
                break;
            case 'YYYY MM DD':
                date = `${year} ${month} ${day}`;
                break;
            case 'YYYY.MM.DD':
                date = `${year}.${month}.${day}`;
                break;
        }
        return date;
    }

    /** @Parma : HTML Element
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


    /** TODO 후에 jQuery 제거
     * jQuery datepicker */
    ui() {
        $('[data-type="datepicker"]').datepicker({
            monthNames: ["01","02","03","04","05","06","07","08","09","10","11","12"],
            monthNamesShort: ["01","02","03","04","05","06","07","08","09","10","11","12"],
            dayNamesMin: [ "일", "월", "화", "수", "목", "금", "토"],
            showMonthAfterYear:true,
            showOtherMonths: true,
            // changeMonth: true,
            // changeYear: true,
            dateFormat: "yy-mm-dd",
            yearSuffix: ".",
            beforeShow: function(input, inst) {
                $('#ui-datepicker-div').addClass('datepicker-wrapper');
            }
        });
    }
}