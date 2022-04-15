const inputTag = document.getElementById('calendar');

CalendarLib.inputStyle(inputTag);

new CalendarLib({
	el: inputTag, /* Input 태그 위치*/
	clickEvent: false, /* click Event를 통해 닫힐껀지 */
	duration: true, /* 시작일과 종료일로 기간을 정할 것인지*/
	format: 'YYYY.mm.dd', /* 데이터를 반환 받을 포맷 및 Input 태그에 보일 format*/
	style: 'normal', /* CalendarLib 적용할 Css */
	prev: false, /* 이전 날짜가 클릭할 수 있는지 여부 */
	success(rtnData) {
		console.log(rtnData);
	},
});