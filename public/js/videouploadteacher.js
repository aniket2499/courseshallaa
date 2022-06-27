(function($){
    var $formvalidate = jQuery('#videoinput');

    function bindEvents(deleteId,coursename,path){
        jQuery(`#${deleteId}`).on('click',function(event){
            event.preventDefault();
            console.log(deleteId);
            console.log(coursename);
            var requestConfig = {
                method: 'POST',
                url: '/mainpage/deletevideo',
                contentType: 'application/json',
                data: JSON.stringify({"deleteId": deleteId, "coursename":coursename, "path":path})
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                
                var requestConfig = {
                    method: 'GET',
                    url: '/mainpage/uploadedvideos/'+ coursename,
                    contentType: 'application/json',
                };
                jQuery.ajax(requestConfig).then(function (responseMessage){
                    responseMessage = JSON.parse(responseMessage)
                    var videosblock = jQuery('#videos')
                    document.getElementById('videos').innerHTML = "";
                    console.log(responseMessage)
                    for(let x of responseMessage[0].videos){
                        console.log(x);
                        var videosblock = jQuery('#videos')
                        console.log(x.videotitle)
                        let video_block = `
                            <div class="container p-2 m-0">
                                <div class="row pb-2">
                                    <div class="col-7">
                                        <div class="container p-2">
                                            <video controls style="height: 300px; width:533.25px">
                                            <source src="${x.path}"> </source>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="row p-2"> <h4> Title </h4> </div>
                                        <div class="row p-2"> ${x.videotitle} </div>
                                        <div class="row p-2"> <h4> Sequence </h4> </div>
                                        <div class="row p-2"> ${x.sequencenumber} </div>
                                        <div class="row p-2"> <button class="btn btn-danger w-25"  id="${x.sequencenumber}"> Delete </button> </div>
                                    </div>
                                </div>
                            </div>
                        `
                        videosblock.append(video_block);
                    
                        bindEvents(x.sequencenumber,coursename,x.path);
                    }
                });
            });
        })
    };

    jQuery(document).ready(function(){

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

        var quill = new Quill('#videodescription', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
          });

        var form = jQuery('#videoinput');
    
        var coursename = document.getElementById('coursename').value;
        
        var requestConfig = {
            method: 'GET',
            url: '/mainpage/uploadedvideos/'+ coursename,
            contentType: 'application/json',
        };
        jQuery.ajax(requestConfig).then(function (responseMessage){
            responseMessage = JSON.parse(responseMessage)
            console.log(responseMessage)
            debugger;

            for(let x of responseMessage.videos){
                var videosblock = jQuery('#videos')
                console.log(x.videotitle)

                let video_block = `
                            
                                <div class="row pb-2">
                                    <div class="col-7">
                                        <div class="container p-2">
                                            <video controls style="height: 300px; width:533.25px">
                                            <source src="${x.path}"> </source>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class= "row">

                                            <div class= "row pb-1"> <span> <b> Title: </b> ${x.videotitle} </span> </div>
                                            <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${x.sequencenumber} </span> </div>
                                        </div>
                                        <div class="row ms-1"> <button class="btn btn-danger w-25"  id="${x.sequencenumber}"> Delete </button> </div>
                                    </div>
                                </div>
                        `
                        videosblock.append(video_block);

                console.log(document.getElementById(x.sequencenumber))
                bindEvents(x.sequencenumber,coursename,x.path);
            }
        });

        form.submit(function(event){
            
            debugger;
            event.preventDefault();
            
            var files = document.getElementById('video').files[0];
            var coursename = document.getElementById('coursename').value;
            var videotitle = document.getElementById('videotitle').value;
            var description = quill.root.innerHTML;
            // var description = document.getElementById('videodescription').value;
            formData = new FormData();

            errormessages = []
            if(!files){
                errormessages.push("fileinput empty")
            }
            if(!videotitle || videotitle.trim() == "" || typeof(videotitle) != "string"){
                errormessages.push("Video tilte must be a string and non empty")
            }

            if(errormessages.length >0){
                let estring = "<ul>"
                for(let x of errormessages){
                    estring = estring + `<li> ${x} </li>`
                }
                document.getElementById("errors").innerHTML = estring;
                //validation
            }
            
                formData.append('video',files);
                formData.append('coursename',coursename);
                formData.append('videotitle',videotitle);
                formData.append('description',description);
            
                var requestConfig = {
                    method: 'POST',
                    url: '/mainpage/uploadvideo',
                    contentType: 'multipart/form-data',
                    data: formData,
                    processData: false,
                    contentType: false
                };


                jQuery.ajax(requestConfig).then(function (responseMessage){
                    videoinfo = responseMessage.data
                    console.log(videoinfo.videotitle)
                    var videosblock = jQuery('#videos')

                    let video_block = `
                            <div class="container m-0">
                                <div class="row pb-2">
                                    <div class="col-7">
                                        <div class="container p-2">
                                            <video controls style="height: 300px; width:533.25px">
                                            <source src="${videoinfo.path}"> </source>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class= "row">
                                            <div class= "row pb-1"> <span> <b> Title: </b> ${videoinfo.videotitle} </span> </div>
                                            <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${videoinfo.sequencenumber} </span> </div>
                                        </div>
                                        <div class="row ms-1"> <button class="btn btn-danger w-25"  id="${videoinfo.sequencenumber}"> Delete </button> </div>
                                    </div>
                                </div>
                            </div>
                        `
                            videosblock.append(video_block);

                    bindEvents(videoinfo.sequencenumber,coursename,videoinfo.path);
                });
            
        });
    });
})(jQuery);