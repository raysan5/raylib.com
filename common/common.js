/* Cookies */
// Source: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

/* Analytics */
if(getCookie("confirmed_analytics") !== "true") {
    document.body.innerHTML +=
        "<div id='analytics-banner'>\
        <p><strong>NOTE: </strong>This website uses Google Analytics to collect visitor statistics.</p>\
        <button id='analytics-confirm'><strong>I UNDERSTAND</strong></button>\
        </div>";

    const div_analyticsBanner = document.getElementById("analytics-banner");
    const btn_analyticsConfirm = document.getElementById("analytics-confirm");

    btn_analyticsConfirm.onclick = function() {
        div_analyticsBanner.setAttribute("confirmed", "true");
        document.cookie += "confirmed_analytics=true;";
    };
}