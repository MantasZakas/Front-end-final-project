"use strict";

function googleMap() { //needs to be in global scope
    let myLatLng = {lat: 55.7243307, lng: 21.1270047660435};
    let mapProp = {
        center: new google.maps.LatLng(myLatLng),
        zoom: 18,
    };
    let map = new google.maps.Map(document.getElementById("google_map"), mapProp);
    let marker = new google.maps.Marker({  //TODO change marker icon
        position: (myLatLng),
        map: map,
    });
}

$(function () {

    const PRICINGPLANS = "json/pricing_plans.json";
    const PROGRESSBARS = "json/progress_bars.json";
    let pricingPlansHtml = "";

    Ajax(PRICINGPLANS, processPricingPlans);
    Ajax(PROGRESSBARS, processProgressBars);

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

    /**
     *
     * @param bars (array)
     */
    function processProgressBars(bars) {
        bars = bars["progress bars"];
        console.log(bars);
        let i = 0;
        loopProgressBars(bars, i);

        // getPosition(document.getElementById("progress_bar_container"));

        // for (let barNo in bars) {
        //     if (bars.hasOwnProperty(barNo)) {
        //         console.log(bars[barNo]);
        //         console.log((bars[barNo]).progress);
        //         console.log(document.getElementById(
        //             "prog" + (bars[barNo]).id
        //         ));
        //         // setTimeout (function() {displayProgressBars(bars[barNo])}, 1000);
        //         displayProgressBars(bars[barNo]);
        //
        //     }
        // }
    }

    /**
     * Self calling loop with a set time delay
     * @param bars (array)
     * @param i (integer)
     */
    function loopProgressBars(bars, i) {
        setTimeout(function () {
            displayProgressBars(bars[i]);
            if (i < bars.length - 1) { //restart loop if condition is met
                i++;
                loopProgressBars(bars, i) //pass on i
            }
        }, 500)
    }

    /**
     *
     * @param bar (array)
     */
    function displayProgressBars(bar) {
        let barElement = document.getElementById(
            "prog" + bar.id
        );
        barElement.style.backgroundColor = bar.color;
        barElement.style.width = bar.progress;
        let barPercentage = barElement.firstElementChild.lastElementChild;
        barPercentage.innerHTML = bar.progress;
        setTimeout( function () {
            barPercentage.style.backgroundColor = "#ffffff";
        }, 500);
        let barTag = barElement.firstElementChild.firstElementChild;
        barTag.style.backgroundColor = bar.color;
        setTimeout(function () {
            barTag.innerHTML = bar.name;
            barTag.classList.add("mx-3");
            barTag.classList.remove("invisible");
            barTag.style.color = "#ffffff";
        }, 1000);
        //TODO progress percentage tag needs to be svg, percentage number needs to grow

    }

    function getPosition(element) {
        // let position = 0;
        // let i = 50;
        // while (element || i) {
        //     position += (element.offsetTop - element.scrollTop + element.clientTop);
        //     i--;
        //     console.log(i);
        // }
        // console.log(position);
        // return position;

        let position = (element.offsetTop - element.scrollTop + element.clientTop);
        console.log(position);

    }
});

//TODO add script to make dropdown not work on click, link below
//https://stackoverflow.com/questions/42183672/how-to-implement-a-navbar-dropdown-hover-in-bootstrap-v4/42183824
//TODO add transition to dropdown
//TODO make custom social menu dropright