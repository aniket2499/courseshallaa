(function($){

    jQuery(document).ready(function() {
        jQuery('#example').DataTable();

        var requestConfig = {
            method: 'GET',
            url: '/grades/getassignments',
            contentType: 'application/json'
        };

        jQuery.ajax(requestConfig).then(function(responseMessage){

        })
    });

})(jQuery);