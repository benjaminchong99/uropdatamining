//console.log(wordHistoryLinked, listSuggestionsLinked) at the end of code for searched values
//console.log(imageplease) at the end of code for url of current image. Note that variable is in function, hence req to add global var first.

//for later function purposes, do not nmodify
let optionsAvailable = null;
let wordHistory = [];
let wordHistoryLinked = [];
let listSuggestions = []; //req for previous function to work
let suggestionHistory = [];
let listSuggestionsLinked = [];
let finallyPageid = null;
let pageID = null;

/**GROUP 1: SEARCH BAR */
function setup() {

    // START WITH USER INPUT    
    userInput = document.getElementById('userinput');
    //userInput = select("#userinput");
    termTosearch = userInput.value;
    console.log(userInput.value);
    startSearch(termTosearch);
};


function startSearch(termTosearch) {
    encodedTermtoSearch = encodeURIComponent(termTosearch);
    console.log('Querying: ' + termTosearch); // to show what youaresearching for
    let urlforContent = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTermtoSearch}&format=json`;
    console.log(urlforContent);
    loadJSON(urlforContent, gotContent, 'jsonp'); //load content
};


// start of defining functions used in setup()
function gotContent(data){ //FUNCTION REQ TO SHOW OPTIONS IN DYM
    console.log(data);
    optionsAvailable = data.query.search;
    optionsAvailable.forEach(optionsmaybe);
};


function optionsmaybe(element, index){ // DEF REQ FOR LATER
    title = optionsAvailable[index]['title'];
    optionName = `option_${index}`;

    document.getElementById(optionName).innerHTML = index +":" + title + '<br>';    
};


/***END OF GROUP 1: SEARCH BAR
 * WOULD HAVE ALRDY SET UP UNTIL WEBPAGE SHOWS THE 10 OPTIONS
 ***/

function clearHistory(){
    wordHistory = [];
    wordHistoryLinked = [];
    listSuggestions = [];
    listSuggestionsLinked = [];
    suggestionHistory = [];
    document.getElementById('searchedWords').innerHTML = wordHistoryLinked 
    document.getElementById('listSuggest').innerHTML = listSuggestionsLinked
    document.getElementById('wordSearched').innerHTML = ''
    collectionJSON = {}
}

