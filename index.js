'use strict';

// put your own value below!
const apiKey = 'qaTccymBsOTDbKv6BpCmijDVAxOEaIESENfo8mX7'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

// format query params that get added to searchURL
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //(name of park, image, description, address, and link to website)
    $('#results-list').append(
      `<hr>
      <li>
      <h3>${responseJson.data[i].fullName}</h3>
      <img src='${responseJson.data[i].images[0].url}' >
      <p>${responseJson.data[i].description}</p>
        ${responseJson.data[i].addresses[0].line1}
        ${responseJson.data[i].addresses[0].line2}
        ${responseJson.data[i].addresses[0].line3}
        ${responseJson.data[i].addresses[0].city},
        ${responseJson.data[i].addresses[0].stateCode}
        ${responseJson.data[i].addresses[0].postalCode}
      </p>
      <a href='${responseJson.data[i].url}'>Park Website</a>
      </li>
      <hr>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

// get parks info
function getParksInfo(query, limit=10) {
  // set params to be added to fetch url
  const params = {
    stateCode: query,
    limit,
    api_key: apiKey
  };
  // params get passed into format function and set to query string variable
  const queryString = formatQueryParams(params)
  // add params to url
  const url = searchURL + '?' + queryString;
  // log url to console
  console.log(url);

  // fetch url and convert to json, else throw error if doesn't work. Then display results
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

// take values from search inputs and pass into getParksInfo function on submit click
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParksInfo(searchTerm, maxResults);
  });
}

// run functions
$(watchForm);