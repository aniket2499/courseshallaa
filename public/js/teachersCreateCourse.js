(function($){

    jQuery(document).ready(function() {

        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
          
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
          
            ['clean']                                         // remove formatting button
        ];

        var quill = new Quill('#description', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
          });

        jQuery("#addcoursebutton").on("click",function(event){
            event.preventDefault();
            var data = quill.root.innerHTML;
            
            let formdata = {};
            formdata.coursename = document.getElementById("coursename").value;
            formdata.coursetag = document.getElementById("coursetag").value;
            formdata.description = data;
            formdata.startdate = document.getElementById("startdate").value;
            formdata.enddate = document.getElementById("enddate").value;

            var requestConfig = {
                method: 'POST',
                url: '/mainpage/addcourse',
                contentType: 'application/json',
                data: JSON.stringify({"formdata": formdata})
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                
            })
        })

        var requestConfig = {
            method: 'GET',
            url: '/mainpage/gettagsfordropdown',
            contentType: 'application/json'
        };

        jQuery.ajax(requestConfig).then(function(responseMessage){
            console.log(responseMessage.tags);
            for (x of responseMessage.tags){
                let dropdown = jQuery('#coursetag');
                dropdown.append(jQuery('<option>').attr("value",x).html(x))
            }
        })
    });

})(jQuery);