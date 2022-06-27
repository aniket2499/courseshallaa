(function($){

    form.submit(function(event){
        // jQuery('#example').DataTable();
        jQuery('#error').submit((event),function(){
        let coursename = document.getElementById('coursename').value 
        let coursetag = document.getElementById('coursetag').value
        let description = document.getElementById('description').value
        let startdate = document.getElementById('startdate').value
        let enddate = document.getElementById('enddate').value

        errors1=[];

        if(!coursename) error.push("enter coursename")
        if(coursename.trim.length === 0) error.push("it should not be empty string")
        if(typeof(coursename) !== "string") error.push("it should not be a number")

        if(!description) error.push("enter coursename")
        if(description.trim.length === 0) error.push("it should not be empty string")
        if(typeof(description) !== "string") error.push("it should not be a number")
        
        if(!coursetag) error.push("enter coursename")

        let regex = /(((0[1-9]|1[0-2])\/([01][1-9]|10|2[0-8]))|((0[13-9]|1[0-2])\/(29|3[01]29|30))|((0[13578]|1[0,2])\/31))\/[0-9]{4}/gim;
        if (!startdate.match(regex))
        error.push("Error: Start date is not in proper format, Please enter proper date ")
        if (!enddate.match(regex))
        error.push("Error: End date is not in proper format, Please enter proper date ")
        given=startdate
        current=new Date()
        current.setHours(0,0,0,0)
        given=new Date(given)
        if(given<current) error.push("Error: Date mentioned should not be greater than current date")
        if(startdate>enddate) error.push("Error: STart date must be before end date")

        if(error.length >0){
            let estring = "<ul>"
            for(let x of error){
                estring = estring + `<li> ${x} </li>`
            }
            document.getElementById("error").innerHTML = estring;
            //validation
        }
    })


        // var requestConfig = {
        //     method: 'GET',
        //     url: '/grades/getassignments',
        //     contentType: 'application/json'
        // };

        // jQuery.ajax(requestConfig).then(function(responseMessage){

        // })
    });

})(jQuery);