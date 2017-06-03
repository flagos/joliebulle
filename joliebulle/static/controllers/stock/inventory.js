

function addInput(divName, unit){

    document.getElementById(divName).innerHTML += '<br>';
    classNames = ['inventory-name-input', 'inventory-qty-input'];
    for (var i = 0, c = classNames.length; i < c; i++) {
        // new_input = document.createElement('input');
        // new_input.innerHTML = '<input type="text" class="'+classNames[i]+' form-control">';
        var h = '<input type="text" class="'+classNames[i]+' form-control">';
        document.getElementById(divName).innerHTML += h;
    }
    document.getElementById(divName).innerHTML += "<div class='inventory-unit'>"+unit+"</div>";

}
