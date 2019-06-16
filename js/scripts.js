"use strict";

$(function(){

    const PRICINGPLANS = 'js/prising_plans.json';

    // // $.get(PRICINGPLANS, processPricingPlans());
    //
    // $.get(PRICINGPLANS, function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });
    //
    //
    // function processPricingPlans(data) {
    //     console.log(data);
    // }
    //

    function loadDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
            }
        };
        xhttp.open("GET", PRICINGPLANS, true);
        xhttp.send();
    }

    loadDoc();
});