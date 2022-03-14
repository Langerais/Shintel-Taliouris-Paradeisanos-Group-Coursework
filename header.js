window.onscroll = function() {headerToggleSticky()};


var header = document.getElementById("myHeader");


var sticky = header.offsetTop;


function headerToggleSticky() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}