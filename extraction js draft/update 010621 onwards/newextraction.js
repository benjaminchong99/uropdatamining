let optionsAvailable = null;
let wordHistory = [];
let pageID = null;

function setup() {
    
    userInput = document.getElementById('userinput')
    //userInput = select("#userinput");
    termTosearch = userInput.value
    console.log(userInput.value)
    startSearch(termTosearch);
}

function startSearch(termTosearch) {
   
    encodedTermtoSearch = encodeURI(termTosearch)

    console.log('Querying: ' + termTosearch); // to show what youaresearching for

    let urlforContent = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTermtoSearch}&format=json`
    console.log(urlforContent)
    
    loadJSON(urlforContent, gotContent, 'jsonp'); //load content
}

/* ***END OF setup() FUNCTION*** */


// start of defining functions used in function
function gotContent(data){
    console.log(data);
    optionsAvailable = data.query.search;
    optionsAvailable.forEach(optionsmaybe)
}
// ***END OF gotContent FUNCTION***

function optionsmaybe(element, index){
    title = optionsAvailable[index]['title']
    snippet = optionsAvailable[index]['snippet']
    pageid = optionsAvailable[index]['pageid']
    optionName = `option_${index}`

    document.getElementById(optionName).innerHTML = index +":" + title + '<br>';
    
}

// Golden Button

function goldenButton(){
    indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
    console.log(indexSelected)
    selectedOption = optionsAvailable[indexSelected]
    console.log(selectedOption)

    document.getElementById('wordSearched').innerHTML = selectedOption['title']
    description = selectedOption['snippet']
    document.getElementById('contentDisplay').innerHTML = description + '...'

    encodedOption = encodeURI(selectedOption['title'])
    hyperlink = `https://en.wikipedia.org/wiki/${encodedOption}`;
    //document.getElementById('getLink').innerHTML = hyperlink;
    WikiLink(hyperlink) //get hyperlink

    wordHistory.push(selectedOption['title'] + ' ');
    document.getElementById('searchedWords').innerHTML = wordHistory; //get wordHistory

    endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;
    console.log(endpoint)

    loadJSON(endpoint, gotImage, 'jsonp'); //load content
}

function WikiLink(hyperlink) {
    var str = hyperlink;
    var result = str.link(hyperlink);
    document.getElementById("getLink").innerHTML = result;
}   

function gotImage(data){

    myJSON = JSON.stringify(data);
    console.log(myJSON);
    startofURL = myJSON.search('https')
    endofURL = myJSON.search('.jpg')
    if (startofURL === -1 || endofURL === -1){
        imageplease = ''
    } else{
        imageplease = myJSON.substring(startofURL, endofURL+4)
        console.log(imageplease)
    }

    img = document.createElement('img'); 
    img.src = imageplease; 
	document.getElementById('imghtml').src = imageplease;
    getSuggestions()
}


function getSuggestions(){
    urlSuggestions =`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`
    loadJSON(urlSuggestions, findSuggestions, 'jsonp'); //load content
}

function findSuggestions(data){
    helloSuggestions = JSON.stringify(data);
    console.log(helloSuggestions);
    
    let links = helloSuggestions.match(/\[\[([^\]]*)\]\]/g)
    cleanedLinks = []
    links.forEach(element => {
        cleanedLinks.push(element.replace( /(^.*\[|\].*$)/g, ''));
    });
    console.log(links);

    suggestedList = cleanedLinks.slice(0,15)
    suggestedList.forEach(createSuggestions);        
    function createSuggestions(element, index) {
        suggestedID = `suggestion_${index}`
        document.getElementById(suggestedID).innerHTML = element
    }    
}

function suggestionButton(){
    indexSuggestion = document.getElementById('selectSuggestion').options.selectedIndex;
    termTosearch = suggestedList[indexSuggestion];
    startSearch(termTosearch);
}