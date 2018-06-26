function daysInMonth (month) {
    return new Date((new Date()).getFullYear(), month, 0).getDate();
}
//alert(daysInMonth(6));
produceTh(daysInMonth(6));


function produceTh(num){
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var d = new Date();
var month=monthNames[d.getMonth()];
//alert(month);
var i;
$(document).ready(function() {
for(i=1;i<=num;i++){
var d = new Date("06/"+i+"/"+(new Date()).getFullYear());
var dayName = days[d.getDay()];

var th="<th>"+month +i+"<br>("+dayName+")</th>";

$('#header_th').append(th);


}
});
}