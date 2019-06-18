"use strict";

function googleMap() { //needs to be in global scope
    let myLatLng = {lat: 55.7243307, lng: 21.1270047660435};
    let mapProp= {
        center:new google.maps.LatLng(myLatLng),
        zoom: 18,
    };
    let map = new google.maps.Map(document.getElementById("google_map"),mapProp);
    let marker = new google.maps.Marker({  //TODO change marker icon
        position: (myLatLng),
        map: map,
    });
}

$(function () {

    const PRICINGPLANS = "json/pricing_plans.json";
    let pricingPlansHtml = "";

    Ajax(PRICINGPLANS, processPricingPlans);

    /**
     *
     * @param url (string)
     * @param callBack (function)
     */
    function Ajax(url, callBack) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callBack(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    /**
     * Construct html for "pricing plans" section from json
     * @param plans (object)
     */
    function processPricingPlans(plans) {
        plans = plans["pricing plans"];
        for (let planNo in plans) {
            if (plans.hasOwnProperty(planNo)) {
                let highlighted = '';
                if (plans[planNo].highlight) highlighted = ' class="highlighted"'; //add highlighted class if needed
                pricingPlansHtml += '<div class="col-md-4 col-12 mb-5"><table class="table table-bordered text-center">' +
                    '<tr><th' + highlighted + '><div class="hexagon">' +
                    '<h5>' + (plans[planNo]).price + '</h5>' +
                    '<h6>' + (plans[planNo]).period + '</h6></div>' +
                    '<span>' + (plans[planNo]).name + '</span></th></tr>';  //table heading ends here
                for (let feature in (plans[planNo]).features) {
                    if ((plans[planNo]).features.hasOwnProperty(feature)) {
                        let check = '<i class="fas fa-times text-danger"></i> ';
                        if (((plans[planNo]).features)[feature]) check = '<i class="fas fa-check text-success"></i> ';
                        pricingPlansHtml += '<tr><td>' + check + feature + '</td></tr>'
                    }
                } //features end here
                pricingPlansHtml += '<tr><td><button id="order' + (plans[planNo]).id + '" class="btn border my-3" type="button">' +
                    '<i class="fas fa-shopping-cart"></i><i> Order Now</i></button></td></tr></table></div>';
            } //order now button ends here
        }
        $("#pricing_plans_section").html(pricingPlansHtml);
    }
});

//TODO add script to make dropdown not work on click, link below
//https://stackoverflow.com/questions/42183672/how-to-implement-a-navbar-dropdown-hover-in-bootstrap-v4/42183824
