var year, month, month_day, monthName,dataTable ;
var repeat = 0;
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function daysInMonth(year, month) {

    month_days = new Date(year, month, 0).getDate();
    month_days = parseInt(month_days);
    return month_days;
}


$(document).ready(function () {

    $('#year').on('change', function () {
        year = this.value;
    });
    $('#month').on('change', function () {
        month = this.value;
		if (typeof dataTable != 'undefined'){
				dataTable.destroy();
			}
		$('#shiftTable tbody,thead').empty();
			
        produceTh(month, year, daysInMonth(year, month));

    });
});
function produceTh(month, year, num) {
     monthName = monthNames[month - 1];

    var i;
    $(document).ready(function () {
	//common fields irrespective of num of days in a month.
	 var th='<tr class="sticky-header"><th class="text-center extra sticky-cell"  >Remove</th><th class="text-center extra sticky-cell"  >Auto-Fill</th><th class="text-center sticky-cell"  >Module</th> <th class="text-center sticky-cell"  >Gid</th> <th class="text-center sticky-cell"  >Name</th><th class="text-center sticky-cell"  >Cab Required</th><th class="text-center sticky-cell"  >Mobile</th>';
        for (i = 1; i <= num; i++) {
            var d = new Date(monthName + "/" + i + "/" + year);
            var dayName = days[d.getDay()];

           th += "<th>" + monthName + i + "<br>(" + dayName + ")</th>";

                  }
				  th+='</tr>';
		 $('#header_th').append(th);
       
    });
	 ajaxCall(year, monthName);
}
function saveFile(data,year,monthName){
$.ajax({
        type: 'POST',
		dataType: "json",
        contentType: 'application/json',
		data: data,
        url: '/saveFile?year='+year+'&month='+monthName,
		error: function (response) {
             $('#export').text(JSON.stringify(response));
        },
        success: function (response) {
            
			alert('File saved successfully');
            
        }		
    });

}
var shiftValue=null;

 $(document).on('click', '.table-auto-fill', function autoFill(){
 if (confirm("Proceeding further will change the data for the entire row based on the first-day shift value, which will over-ride the entire Leave and WFH data for the whole row")) {
var n=8;
 var $row = $(this).closest("tr");

shiftValue=$row.find('td:nth-child('+n+')').text();
if(shiftValue=='-'){
shiftValue=$row.find('td:nth-child('+(n+1)+')').text();
if(shiftValue=='-'){
shiftValue=$row.find('td:nth-child('+(n+2)+')').text();
}
}
if(shiftValue.toUpperCase() !='L'&& shiftValue.toUpperCase() !='WFH'){
$row.find('td:gt(6)').each (function() {
$(this).text(shiftValue);
});   }
//});
colorCode();
    } else {
        
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
            if (errorThrown == "Not Found" && repeat <= 3) {
                
				if(['Jan'].includes(monthName)){
				month=15;
				monthName = monthNames[(month - 1) - (repeat)];
				year=year-1;
                ajaxCall(year, monthName);
				repeat++;
				}
				else{
                monthName = monthNames[(month - 1) - repeat];
				ajaxCall(year, monthName);
				repeat++;
				}
				
            }
            else {
			$('.table-file-data').text('No data available, please select any lower month/year');
			$('h5 b').addClass('text-danger');
                alert('No json file found even for previous months. Please make sure the that atleast one json file for the last 3 months exists in the server');
            }
$('#information').html('');
        },
        success: function (data) {
			
		$('#information').html('Showing '+year +'-'+monthName+' data');
		$('h5 b').removeClass();
		$('h5 b').addClass('text-success');
            createTable(data);
            repeat = 0;
		
        }
    });

}
function addRow(){
if (typeof dataTable != 'undefined'){
				dataTable.destroy();
			}
 var tr = $('<tr>');
  $(tr).append('<td class="extra sticky-cell"><button type="button" class="table-remove btn btn-danger btn-rounded btn-sm my-0">Remove</button></td><td class="extra sticky-cell"><button type="button" class="table-auto-fill btn btn-success btn-rounded btn-sm my-0">Auto-Fill</button></td><td class="pt-3-half sticky-cell" contenteditable="true">Technical</td> <td class="pt-3-half sticky-cell" contenteditable="true">434545</td> <td class="pt-3-half sticky-cell" contenteditable="true">Naveen</td><td class="pt-3-half sticky-cell" contenteditable="true">No</td><td class="pt-3-half sticky-cell" contenteditable="true">1234567890</td>');
  for (var i = 0; i < month_days; i++) {

                $(tr).append('<td class="pt-3-half days even" role="row" contenteditable="true">G</td></tr>');
            }
			  $('#dataTr').append(tr);
			  colorCode();
}
function createTable(data) {
    var totalMessages = Object.keys(data[0]).length;
    totalMessages = totalMessages-5;
	var buffer=5;
	console.log("totalMessages:"+totalMessages);
	console.log("month_days:"+month_days);
	
    var keys = Object.keys(data[0]);
	

    $.each(data, function (key, val) {
        var tr = $('<tr>');


        $(tr).append('<td class="extra sticky-cell"  ><button type="button" class="table-remove btn btn-danger btn-rounded btn-sm my-0">Remove</button></td><td class="extra sticky-cell"  ><button type="button" class="table-auto-fill btn btn-success btn-rounded btn-sm my-0">Auto-Fill</button></td>');

       

        if (month_days < totalMessages) {
            console.log('month_days<totalMessages');
			
            for (var i = 0; i < month_days+buffer; i++) {
			
			if(i>=buffer){
			 $(tr).append('<td class="pt-3-half days" contenteditable="true">'+ val[keys[i]] +'</td></tr>');
			}
			else {
                $(tr).append('<td class="pt-3-half sticky-cell" contenteditable="true"  >'+ val[keys[i]] +'</td></tr>');
            }
			}
			
        }
        else if (month_days > totalMessages) {
            console.log('month_days>totalMessages');
            for (var i =0; i < totalMessages+buffer; i++) {

            if(i>=buffer){
			 $(tr).append('<td class="pt-3-half days" contenteditable="true">'+ val[keys[i]] +'</td></tr>');
			}
			else {
                $(tr).append('<td class="pt-3-half sticky-cell" contenteditable="true"  >'+ val[keys[i]] +'</td></tr>');
            }
            }
			for (var j =buffer; j < (month_days-totalMessages)+buffer; j++) {

               if(j>=buffer){
			 $(tr).append('<td class="pt-3-half days" contenteditable="true">'+ val[keys[j]] +'</td></tr>');
			}
			else {
                $(tr).append('<td class="pt-3-half sticky-cell" contenteditable="true"  >'+ val[keys[j]] +'</td></tr>');
            }
            }
			
        }
        else {

            for (var i = 0; i < totalMessages+buffer; i++) {

               if(i>=buffer){
			 $(tr).append('<td class="pt-3-half days" contenteditable="true">'+ val[keys[i]] +'</td></tr>');
			}
			else {
                $(tr).append('<td class="pt-3-half sticky-cell" contenteditable="true"  >'+ val[keys[i]] +'</td></tr>');
            }
            }

        }

        $('#dataTr').append(tr);

    });
    colorCode();
}

function applyDataTables() {

    dataTable = $('#shiftTable').DataTable( {
		"destroy":true,
		"searching": false,
		"paging":false,
    } );
	
	var buttons = new $.fn.dataTable.Buttons(dataTable, {
	
     buttons: [
       'copyHtml5',
       'excelHtml5',
       'csvHtml5'
    ]
}).container().appendTo($('.export-buttons'));
};


function colorCode() {

    $("#shiftTable tbody td").each(function () {

        var text = $(this).text();
		var header=$(this).closest('table').find('th').eq($(this).index()).text();
	//console.log(header.indexOf('Sun')>0);
        if (text.toUpperCase() == 'G' && (header.indexOf('Sun')<0 || header.indexOf('Sat')<0 )) {
		$(this).removeClass('leave morningShift wfh secondShift');
            $(this).addClass('generalShift');
        }
        if (text.toUpperCase() == 'L') {
		$(this).removeClass('generalShift morningShift wfh secondShift');
            $(this).addClass('leave');
        }
        if (text.toUpperCase() == 'F') {
		$(this).removeClass('generalShift leave wfh secondShift');
            $(this).addClass('morningShift');
        }
        if (text.toUpperCase() == 'WFH') {
		$(this).removeClass('generalShift morningShift leave secondShift');
            $(this).addClass('wfh');
        }
        if (text.toUpperCase() == 'S') {
		$(this).removeClass('generalShift morningShift wfh leave');
            $(this).addClass('secondShift');
        }
		 if (text.toUpperCase() == 'SUN') {
		 if(header.indexOf('Sun')>0 || header.indexOf('Sat')>0){
		 	$(this).removeClass('generalShift morningShift wfh leave secondShift');
			$(this).text('-');
		}else{
		$(this).removeClass('morningShift wfh leave secondShift');
		$(this).text('G');
            $(this).addClass('generalShift');
        }
        }
		if(header.indexOf('Sun')>0 || header.indexOf('Sat')>0){
		 	$(this).removeClass('generalShift morningShift wfh leave secondShift');
			$(this).text('-');
		}
		if(header.indexOf('Sun')>0 && (text.toUpperCase() == 'SUN')){
		 	$(this).removeClass('generalShift morningShift wfh leave secondShift');
			$(this).text('SUN');
			$(this).addClass('sundayWork');
		}
		if (text.toUpperCase() == '-') {
		if(header.indexOf('Sun')>0 || header.indexOf('Sat')>0){
		 	$(this).removeClass('generalShift morningShift wfh leave secondShift');
			$(this).text('-');
		}else{
		$(this).removeClass('morningShift wfh leave secondShift');
		$(this).text('G');
            $(this).addClass('generalShift');
        }
		}

        // compare id to what you want
    });

	applyDataTables();
}

 
$(document).on('blur', 'td.days', function () {
    var text = $(this).text().toUpperCase();
	var header=$(this).closest('table').find('th').eq($(this).index()).text();
	switch (text) {
    case 'G':
		$(this).removeClass('leave morningShift wfh secondShift');
        $(this).addClass('generalShift');
        break; 
     case 'L':
	 	$(this).removeClass('generalShift morningShift wfh secondShift');
        $(this).addClass('leave');
        break; 
	 case 'F':
	 	$(this).removeClass('leave generalShift wfh secondShift');
        $(this).addClass('morningShift');
        break; 
	 case 'S':
	 	$(this).removeClass('leave morningShift wfh generalShift');
        $(this).addClass('secondShift');
        break; 
	 case 'WFH':
	 	$(this).removeClass('leave morningShift generalShift secondShift');
        $(this).addClass('wfh');
        break;
	
		case 'SUN':
		if(!(header.indexOf('Sun')>0)&& !(header.indexOf('Sat')>0)){
		$(this).text('');
		$(this).text('G');
		$(this).removeClass('leave morningShift wfh secondShift sundayWork');
        $(this).addClass('generalShift');
		alert('I do not think this is Sunday. So I changed it back to General Shift');
		}
		
		else{
		if(header.indexOf('Sat')>0){
		 $(this).text('-');
		$(this).removeClass('leave morningShift wfh secondShift generalShift');
        
		alert('I do not think this is Sunday. So I changed it back.');
		}else{
			$(this).removeClass('generalShift morningShift wfh leave secondShift');
			$(this).text('SUN');
			$(this).addClass('sundayWork');
			}
			}
		break;
		case '-':
	if(!(header.indexOf('Sun')>0 || header.indexOf('Sat')>0)){
	 	
		$(this).text('G');
		$(this).removeClass('leave morningShift wfh secondShift sundayWork');
        $(this).addClass('generalShift');
		alert('This is neither Saturday nor Sunday. Please check the data');
		}
		else{
		$(this).removeClass('leave morningShift generalShift secondShift wfh');
		}
        break;
		
    default:
        $(this).text('G');
		$(this).removeClass('leave morningShift wfh secondShift');
        $(this).addClass('generalShift');
		alert('Please check the data you entered, for reference check LEGEND on left. For consistency purposes changing the entered value to "G"');
		
}
   

});


$(document).ready(function () {
    var $TABLE = $('#table');
    var $BTN = $('#export-btn');
    var $EXPORT = $('#export');

	 $(document).on('click', '.table-add', function () {
	addRow();
    });
    $(document).on('click', '.table-remove', function () {
        $(this).parents('tr').detach();
    });

    $(document).on('click', '.table-up', function () {
        var $row = $(this).parents('tr');
        if ($row.index() === 1)
            return; // Don't go above the header
        $row.prev().before($row.get(0));
    });
    $(document).on('click', '.table-down', function () {
        var $row = $(this).parents('tr');
        $row.next().after($row.get(0));
    });

// A few jQuery helpers for exporting only
    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;

    $BTN.click(function () {
        var $rows = $TABLE.find('tr:not(:hidden)');
        var headers = [];
        var data = [];

        // Get the headers (add special header logic here)
        $($rows.shift()).find('th:not(".extra")').each(function () {
            headers.push($(this).text().toLowerCase());
        });
		//headers.push("fileName");

        // Turn all existing rows into a loopable array
        $rows.each(function () {
            var $td = $(this).find("td:not('.extra')");
            var h = {};

            // Use the headers from earlier to name our hash keys
            headers.forEach(function (header, i) {
                h[header] = $td.eq(i).text();
            });
				//h['fileName']=year+month;
            data.push(h);
        });
	
		//save the file to disk
		saveFile(JSON.stringify(data),year,monthName);
        // Output the result
       // $EXPORT.text(JSON.stringify(data));

    });
});