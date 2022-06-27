(function($){
    function bindEvents(vid){
        jQuery(`#${vid.sequencenumber}`).on('click',function(event){
            event.preventDefault();
            var video = document.getElementById('mvideo');
            var videosblock = document.getElementById("source");
            videosblock.setAttribute('src', vid.path);
            video.load();
            document.getElementById("sequencenumber").value = vid.sequencenumber
        })
    };
    
    jQuery(document).ready(function() {
        var course_id = document.getElementById("courseid").value;
        document.getElementById('mvideo').addEventListener('ended', function(e) {
            var requestConfig = {
                method: 'POST',
                url: '/student/updatesequencenumber',
                contentType: 'application/json',
                data: JSON.stringify({"courseid": course_id, "sequencenumber": document.getElementById("sequencenumber").value})
            };

            jQuery.ajax(requestConfig).then(function(responseMessage){
                if(responseMessage.status){
                    var requestConfig = {
                        method: 'GET',
                        url: '/student/enrolled/ajaxvideos/' + course_id,
                        contentType: 'application/json'
                    };
            
                    jQuery.ajax(requestConfig).then(function(responseMessage){
                        let sequencenumber = responseMessage.sequencenumber;
                        document.getElementById("videos").innerHTML = "";
                        var videosblock = jQuery('#videos')
                        var mainvideo = document.getElementById('mvideo');
                        var videosblockmain = document.getElementById("source");
                        videosblockmain.setAttribute('src', responseMessage.videos[0].path);
                        mainvideo.load();
                        document.getElementById("sequencenumber").value = responseMessage.videos[0].sequencenumber
            
                        for(let x of responseMessage.videos){
                            if(x.sequencenumber <= sequencenumber){
                                video_block = `
                                                    <div class="row pb-2">
                                                        <div class="col-7">
                                                            <div class="container p-2">
                                                                <video disablePictureInPicture style="height: 300px; width:533.25px class="vid">
                                                                <source src="${x.path}"> </source> </video>
                                                            </div>
                                                        </div>
                                                        <div class="col-5">
                                                            <div class= "row">
                                                                <div class= "row pb-1"> <span> <b> Title: </b> ${x.videotitle} </span> </div>
                                                                <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${x.sequencenumber} </span> </div>
                                                            </div>
                                                            <div class="row ms-1"> <button class="btn btn-danger w-25"  id="${x.sequencenumber}"> Play </button> </div>
                                                        </div>
                                                    </div>
                                            `
                                    }
                                    else{
                                        video_block = `
                                                    <div class="row pb-2">
                                                        <div class="col-7">
                                                            <div class="container p-2">
                                                                <video disablePictureInPicture style="height: 300px; width:533.25px class="vid">
                                                                <source src="${x.path}"> </source> </video>
                                                            </div>
                                                        </div>
                                                        <div class="col-5">
                                                            <div class= "row">
                                                                <div class= "row pb-1"> <span> <b> Title: </b> ${x.videotitle} </span> </div>
                                                                <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${x.sequencenumber} </span> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            `
                                    }
                            videosblock.append(video_block);
                            jQuery('.vid').on("loadeddata", function() {
                                jQuery('.vid').attr('controlsList', 'nodownload');
                                jQuery('.vid').bind('contextmenu',function() { return false; });
                                jQuery('.vid').attr('disablePictureInPicture', 'true');
                            }); 
                            bindEvents(x);
                        }
                    })
                }
            });
        });

        var requestConfig = {
            method: 'GET',
            url: '/student/enrolled/ajaxvideos/' + course_id,
            contentType: 'application/json'
        };

        jQuery.ajax(requestConfig).then(function(responseMessage){
            let sequencenumber = responseMessage.sequencenumber;

            var videosblock = jQuery('#videos')
            var mainvideo = document.getElementById('mvideo');
            var videosblockmain = document.getElementById("source");
            videosblockmain.setAttribute('src', responseMessage.videos[0].path);
            mainvideo.load();
            document.getElementById("sequencenumber").value = responseMessage.videos[0].sequencenumber

            for(let x of responseMessage.videos){
                if(x.sequencenumber <= sequencenumber){
                    video_block = `
                                        <div class="row pb-2">
                                            <div class="col-7">
                                                <div class="container p-2">
                                                    <video disablePictureInPicture style="height: 300px; width:533.25px class="vid">
                                                    <source src="${x.path}"> </source> </video>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <div class= "row">
                                                    <div class= "row pb-1"> <span> <b> Title: </b> ${x.videotitle} </span> </div>
                                                    <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${x.sequencenumber} </span> </div>
                                                </div>
                                                <div class="row ms-1"> <button class="btn btn-danger w-25"  id="${x.sequencenumber}"> Play </button> </div>
                                            </div>
                                        </div>
                                `
                        }
                        else{
                            video_block = `
                                        <div class="row pb-2">
                                            <div class="col-7">
                                                <div class="container p-2">
                                                    <video disablePictureInPicture style="height: 300px; width:533.25px class="vid">
                                                    <source src="${x.path}"> </source> </video>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <div class= "row">
                                                    <div class= "row pb-1"> <span> <b> Title: </b> ${x.videotitle} </span> </div>
                                                    <div class= "row pb-3"> <span> <b> Sequence Number: </b> ${x.sequencenumber} </span> </div>
                                                </div>
                                            </div>
                                        </div>
                                `
                        }
                videosblock.append(video_block);
                jQuery('.vid').on("loadeddata", function() {
                    jQuery('.vid').attr('controlsList', 'nodownload');
                    jQuery('.vid').bind('contextmenu',function() { return false; });
                    jQuery('.vid').attr('disablePictureInPicture', 'true');
                }); 
                bindEvents(x);
            }
        })
    });

})(jQuery);