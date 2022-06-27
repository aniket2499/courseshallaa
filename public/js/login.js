

(function($){

    jQuery(document).ready(function() {
        username=document.getElementById("#username")
        password=document.getElementById("#password")
        
        new function(username){
            errors1=[]
        if (!username){
            errors1.push("Username not valid")
        }
        // if (typeof username !== "string")
        // username = username.trim();
        // if (username.length === 0)
        // if (!isNaN(username))
        // if(!password)
        }
        if(errormessages.length >0){
            let estring = "<ul>"
            for(let x of errors1){
                estring = estring + `<li> ${x} </li>`
            }
            document.getElementById("errors").innerHTML = estring;
            //validation
        }
        
      


        jQuery(".error").innerHTML("error");
        


        
    
    });

})(jQuery);