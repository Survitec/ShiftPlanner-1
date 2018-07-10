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
    });$('#weekForm')[0].reset();
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
function saveFile(data){
var year=$('#year').val();
var month=$('#month').val();
monthName = monthNames[month - 1];
$.ajax({
        type: 'POST',
		dataType: "json",
        contentType: 'application/json',
		data: data,
        url: '/saveFile?year='+year+'&month='+monthName+'&flag=weekly',
		error: function (response) {
             alert(JSON.stringify(response));
        },
        success: function (response) {
            
			alert('File saved successfully');
            
        }		
    });

}

function saveNewsFile(data){
var password=prompt("Please Enter Password:");
 var totalData ={};
    totalData.data=data;
    totalData.pwd=password;
$.ajax({
		url: '/edit-news',
        type: 'POST',
        contentType: 'application/json',
		data: JSON.stringify(totalData),
		error: function (response) {
             alert("Failed");
        },
        success: function (data) {
            
			alert(data);
            
        }		
    });

}
$(document).ready(function () {


    $('#export-btn').click(function () {
	    var $TABLE = $('#example');
   
        var $rows = $TABLE.find('tbody tr');
        var headers = [];
        var data = [];

        // Get the headers (add special header logic here)
       /*  $($rows.shift()).find('th').each(function () {
            headers.push($(this).text().toLowerCase());
        });   */
		 headers.push('fromdate');
		  headers.push('todate');
		   headers.push('module');
		    headers.push('task');
			 headers.push('taskDesc');
			  headers.push('remarks');
		//headers.push("fileName");

        // Turn all existing rows into a loopable array
        $rows.each(function () {
            var $td = $(this).find("td");
            var h = {};

            // Use the headers from earlier to name our hash keys
            headers.forEach(function (header, i) {
			
                h[header] = $td.eq(i).text();
            });
            data.push(h);
        });
		var stringData=JSON.stringify(data);

	 

		//save the file to disk
		saveFile(stringData);
    });
});
 $(document).on('click', '#deleteRow', function () {
        $(this).parents('tr').detach();
    });
$('#save-btn').click(function () {
	var fromdate=$('.fromDate').text();
	var todate=$('.toDate').text();
	if(todate<fromdate){
	alert("In future you might, but today you cannot time-travel... :). Please check from and to dates below");
	return false;
	}
	else{
 var $TABLE = $('#news-tab');
   
        var $rows = $TABLE.find('tbody tr');
        var headers = [];
        var data = [];

        // Get the headers (add special header logic here)
       /*  $($rows.shift()).find('th').each(function () {
            headers.push($(this).text().toLowerCase());
        });   */
		 headers.push('type');
		  headers.push('description');
		   headers.push('fromDate');
		    headers.push('toDate');
			 headers.push('status');
			  headers.push('remarks');
		//headers.push("fileName");

        // Turn all existing rows into a loopable array
        $rows.each(function () {
            var $td = $(this).find("td:not('.extra')");
            var h = {};

            // Use the headers from earlier to name our hash keys
            headers.forEach(function (header, i) {
		
                h[header] = $td.eq(i).text();
				
            });
            data.push(h);
        });
		var stringData=JSON.stringify(data);

	 

		//save the file to disk
		saveNewsFile(stringData);
		}
   
});
