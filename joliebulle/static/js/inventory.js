

function addInput(divName, className){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = '<input type="text" class="'+className+'-name-input form-control">';
    document.getElementById(divName).appendChild(newdiv);

}
