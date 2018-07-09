var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
$('#weekForm').submit(function (e) {

    e.preventDefault();
	var fromdate=$('#fromdate').val();
	var todate=$('#todate').val();
	if(todate<fromdate){
	alert("In future you might, but today you cannot time-travel... :). Please check from and to dates below");
	return false;
	}
	else{
	var date=$('#fromdate').val();
	var year = date.split("-")[0];
	var month = date.split("-")[1];
	
	 monthName = monthNames[month - 1];
	 //alert(year+monthName);
	var data = $('#weekForm').serializeArray();
	
    //var data = $('#weekForm').serialize();
    $.ajax({
        type: 'POST',
        data: data,
        url: '/saveWeekFile?year='+year+'&month='+monthName,
        success: function (data) {
		alert('done');
        },
		error: function (data) {
		alert(data);
        }
    });
    return false;
	}
});

function ajaxCall(year, monthName) {
    var fileName = year + monthName;
    console.log('file name:' + fileName);
    $.ajax({
        url: 'data/' + fileName + '.json',
        type: 'get',
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {

            console.log("error:" + errorThrown);
            if (errorThrown == "Not Found") {
		alert('No Data found for the specified month');
				
            }
           
            },
        success: function (data) {
		alert(data);
          
        }
    });

}
