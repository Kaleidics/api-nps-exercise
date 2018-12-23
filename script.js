"use strict";

function testApi(search, states, maxResults = 10) {
    console.log("max results", maxResults)
    const api_key = "GUWXNWaEmEjrKSx051jJs4mhOCfsy6sY5o5fLDj3";
    const searchUrl = "https://developer.nps.gov/api/v1/parks";

    let params = {
        q: search,
        stateCode: states,
        limit: maxResults,
        api_key: api_key
    };

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    return fetch(url)

        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            for (let i = 0; i < responseJson.data.length - 1; i++) {

                $("#results-list").append(`
                <li>
                ${responseJson.data[i].fullName}
                <br>${responseJson.data[i].description}
                <br><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
                </li>
                `);
            }
        })
        .catch(error => console.log("1 error happened"));
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    return queryItems.join('&');
}

function registerEvents() {
    $("#search").on("submit", function (event) {
        event.preventDefault();
        $("#results-list").empty();
        
        let searchTerm = $("#search-term").val();
        console.log("search term", searchTerm);

        let stateBoxes = $("#search input[type='checkbox']");
        console.log("state length", stateBoxes.length);

        let numberResults = $("#max-results").val();
        console.log("number results", numberResults);

        let checkedStates = [];
        for (let i = 0; i < stateBoxes.length; i++) {
            let checkBox = $(stateBoxes[i]);
            if (checkBox.is(":checked")) {
                checkedStates.push(checkBox.val());
            }
        }

        checkedStates = checkedStates.join(",");
        console.log("checked states", checkedStates);
        testApi(searchTerm, checkedStates, numberResults);
    });
}

$(registerEvents);