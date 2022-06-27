(function($){

    jQuery(document).ready(function() {
        jQuery('#example').DataTable();

        jQuery('#postgrades').on('click',function(event){
            let coursename = document.getElementById("coursename").value;
            let assignment_id = document.getElementById("assignment_id").value;
            let t = document.getElementById("example");
            let tablelength = jQuery("#example tr").length;

            data = {};

            data.coursename = coursename;
            data.assignment_id = assignment_id;
            data.assignment_details = [];
            
            for(let i=1 ; i < tablelength ; i++){
                let x = t.rows[1].cells;

                // for(y of x){
                    let ass = {};
                    ass.studentusername = x[0].innerHTML.trim();
                    ass.grade = x[1].firstChild.value;
                    data.assignment_details.push(ass);
                    // console.log(x[0].innerHTML.trim());
                    // console.log(x[1].firstChild.value);
                // }
            }
            var requestConfig = {
                method: 'POST',
                url: '/grades/postgrades',
                contentType: 'application/json',
                data: JSON.stringify(data)
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                debugger
                alert("Sucessfully posted Grades")
            })

        });

        jQuery('.buttonclick').on('click',function(){
            let id = this.id;
            let studentusername = id.split("_");
            studentusername = studentusername[1];
            let grade = document.getElementById('grade_'+studentusername).value;
            let assignment_id = document.getElementById('ass_'+studentusername).value;
            let coursename = document.getElementById("coursename").value;

            let data = {}
            
            data.studentusername = studentusername;
            data.grade = grade;
            data.assignment_id = assignment_id;
            data.coursename = coursename;
            
            var requestConfig = {
                method: 'POST',
                url: '/grades/updategrades',
                contentType: 'application/json',
                data: JSON.stringify(data)
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                if(responseMessage.status === true){
                   
                }
            })

            console.log(id);
            debugger;
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