// Functions for the front end of the application

function editComment(id) {
    console.log(id);
    document.getElementById(id).setAttribute("style","display:none;");
    document.getElementById(id+"editForm").setAttribute("style","display:block;");
}

// Used for initialising Javascript components from Materalize Css.
document.addEventListener("DOMContentLoaded", function(event) { 
    M.AutoInit();
  });