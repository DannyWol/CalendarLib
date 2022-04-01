Test = {
    Init() {
        console.log('진입');

        const now = this.DateFormat(new Date());

        console.log(now);

    },

    /* 날짜 변환용 함수 */
    DateFormat(date){
        const year = date.getFullYear();              //yyyy
        let month = (date.getMonth() + 1);          //M
        let day = date.getDate();

        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장

        return year + '-' + month + '-' + day;
    },
}