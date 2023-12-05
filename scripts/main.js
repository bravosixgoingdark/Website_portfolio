function responsive_navbar(){ 
    var x = document.getElementById("topbar");
    if(x.className === "navbar"){
        x.className += " responsive";
    }else{
        x.className = "navbar";
    } // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_topnav
}

