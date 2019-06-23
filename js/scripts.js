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
    let countersArray = [1500, 13, 95771, 384];
    let pricingPlansHtml = "";
    let barsArray = [];
    let i = 0; //progress bar counter, needs to be global because function is self-calling
    let progressLoopStarted = false;
    let counterLoopStarted = false;

    Ajax(PROGRESSBARS, prepareProgressBars);
    Ajax(PRICINGPLANS, processPricingPlans);
    prepareCounterSection ();
    window.addEventListener("scroll", displayGoToTop);
    toggleDivOnClick("shopping_cart", "shopping_cart_div");
    toggleDivOnClick("search_small_screen", "search_div_small_screen");

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
                pricingPlansHtml += '<div class="col-md-4 col-12 mb-5 mt-4"><table class="table table-bordered text-center">' +
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
     * Returns if a DOM element is in the viewport
     * @param element (DOM element)
     * @returns {boolean}
     */
    function isElementVisible(element) {
        let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let topPosition = element.offsetTop - viewportHeight;
        let bottomPosition = element.offsetTop + element.clientHeight;
        let scrollPosition = document.documentElement.scrollTop;
        let visible = false;
        if (scrollPosition >= topPosition && scrollPosition <= bottomPosition) visible = true;
        return visible
    }

    /**
     * Ajax callback that takes external file data and checks page position
     * @param bars (array)
     */
    function prepareProgressBars(bars) {
        barsArray = bars["progress bars"];
        let barsDiv = document.getElementById("progress_bar_container");
        if (isElementVisible(barsDiv)) { //if element is in viewport, do the animation
            loopProgressBars();
        } else {
            window.addEventListener("scroll", function () {
                if (isElementVisible(barsDiv) && !progressLoopStarted) {
                    loopProgressBars();
                }
            });
        }
    }

    /**
     * Self calling loop with a set time delay
     */
    function loopProgressBars() {
        progressLoopStarted = true;
        setTimeout(function () {
            displayProgressBars(barsArray[i]);
            if (i < barsArray.length - 1) { //restart loop if condition is met
                i++;
                loopProgressBars() //pass on i
            }
        }, 500)
    }

    /**
     * Takes a number and shows it growing by 100 increments over 2 seconds
     * @param number (number)
     * @param element (DOM element)
     */
    function growingNumber(number, element) {
        let shownNumber = 0;
        let j = 0;
        function grow() {
            setTimeout(function () {
                element.innerHTML = Math.round(shownNumber).toString();
                if (j < 100) {
                    shownNumber += number / 100;
                    j++;
                    grow()
                }
            }, 20)
        }
        grow();
    }

    function prepareCounterSection () {
        let countersDiv = document.getElementById("counter_section");
        if (isElementVisible(countersDiv)) { //if element is in viewport, do the animation
            processCounterSection();
        } else {
            window.addEventListener("scroll", function () {
                if (isElementVisible(countersDiv) && !counterLoopStarted) {
                    processCounterSection();
                }
            });
        }
    }

    function processCounterSection () {
        counterLoopStarted = true;
        let countersDiv = document.getElementById("counter_section");
        let counterElements = countersDiv.getElementsByTagName("h2");
        let j = 0;
        function counterLoop () {
            setTimeout(function () {
                counterElements[j].parentElement.style.opacity = "1";
                growingNumber(countersArray[j], counterElements[j]);
                if (j < 4) {
                    j++;
                    counterLoop()
                }
            }, 500)
        }
        counterLoop();
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

    function displayGoToTop() {
        console.log(document.documentElement.scrollTop);
        let topButton = document.getElementById("go_to_top");
        console.log(topButton);
        if (document.documentElement.scrollTop > 200) {
            topButton.style.transform = ("rotateX(0deg)");
            topButton.style.opacity = ("1");
        } else {
            topButton.style.transform = ("rotateX(90deg)");
            topButton.style.opacity = ("0");
        }
    }

    /**
     *
     * @param buttonId (string)
     * @param divId (string)
     */
    function toggleDivOnClick(buttonId, divId) {
        document.getElementById(buttonId).addEventListener("click", function() {
            document.getElementById(divId).classList.toggle("d-none");
        });
    }
});