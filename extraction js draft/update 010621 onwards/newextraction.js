let optionsAvailable = null;
let wordHistory = [];
let pageID = null;

function setup() {

    // START WITH USER INPUT    
    userInput = document.getElementById('userinput')
    //userInput = select("#userinput");
    termTosearch = userInput.value
    console.log(userInput.value)
    startSearch(termTosearch);
}

function startSearch(termTosearch) {
   /* 1. CONVERT TERMTOSEARCH TO URL READABLE
      2. LOAD JSON FOR DO YOU MEAN */
    encodedTermtoSearch = encodeURI(termTosearch)

    console.log('Querying: ' + termTosearch); // to show what youaresearching for

    let urlforContent = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTermtoSearch}&format=json`
    console.log(urlforContent)
    
    loadJSON(urlforContent, gotContent, 'jsonp'); //load content
}
/* ***END OF setup() FUNCTION*** */

// start of defining functions used in setup()
function gotContent(data){ //FUNCTION REQ TO SHOW OPTIONS IN DYM
    console.log(data);
    optionsAvailable = data.query.search;
    optionsAvailable.forEach(optionsmaybe)
}
// ***END OF gotContent()***

function optionsmaybe(element, index){ // DEF REQ FOR LATER
    title = optionsAvailable[index]['title']
    //snippet = optionsAvailable[index]['snippet']
    //pageID = optionsAvailable[index]['pageid']
    optionName = `option_${index}`

    document.getElementById(optionName).innerHTML = index +":" + title + '<br>';
    
}

// SEARCH SELECTED TERM FROM OPTIONS AVAILABLE
function goldenButton(){
    indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
    selectedOption = optionsAvailable[indexSelected]
    console.log(selectedOption) // END OF SELECTING OPTION

    pageID = selectedOption['pageid']

    /** SECTION FOR SNIPPET */
    document.getElementById('wordSearched').innerHTML = selectedOption['title']
    description = selectedOption['snippet']
    document.getElementById('contentDisplay').innerHTML = description + '...'

    /** SECTION FOR HYPERLINK */
    encodedOption = encodeURI(selectedOption['title']);
    hyperlink = `https://en.wikipedia.org/wiki/${encodedOption}`;
    //document.getElementById('getLink').innerHTML = hyperlink;
    WikiLink(hyperlink) //get hyperlink

    /** SECTION FOR SEARCH HISTORY */
    OptionTitle = selectedOption['title']
    displayHistory(OptionTitle)

    /** SECTION TO GET IMAGE */
    endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;

    loadJSON(endpoint, gotImage, 'jsonp'); //load content
    getSuggestions() // get suggestions in the second box
}
/** END OF GOLDEN BUTTON FUNCTION */

// defintiions of functions required in goldenButton() 
function WikiLink(hyperlink) { //func req to get & show hyperlink
    var str = hyperlink;
    var result = str.link(hyperlink);
    document.getElementById("getLink").innerHTML = result;
}   

function displayHistory(OptionTitle) {

    wordHistory.push(OptionTitle + ' ');
    document.getElementById('searchedWords').innerHTML = wordHistory; //get wordHistory
}

function gotImage(data){ // func req to get image

    myJSON = JSON.stringify(data);
    startofURL = myJSON.search('https')
    endofURL = myJSON.search('.jpg')
    if (startofURL === -1 || endofURL === -1){
        imageplease = ''
    } else{
        imageplease = myJSON.substring(startofURL, endofURL+4);
    }
    console.log(imageplease);
    img = document.createElement('img'); 
    img.src = imageplease; 
	document.getElementById('imghtml').src = imageplease;
}


function getSuggestions(){ 
    // req to get suggestions by finding freq appeared words in full content
    urlSuggestions =`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`

    loadJSON(urlSuggestions, findSuggestions, 'jsonp'); //load full content of selected option
}

function findSuggestions(data){
    helloSuggestions = JSON.stringify(data);
    //console.log(helloSuggestions);

    // find all suggested words in full content
    let links = helloSuggestions.match(/\[\[([^\]]*)\]\]/g)
    cleanedLinks = []
    links.forEach(element => {
        cleanedLinks.push(element.replace( /(^.*\[|\].*$)/g, ''));
    });
    //console.log(links);
    slicedLinks = []
    slicedLinks = descendingUniqueSort(cleanedLinks).slice(0,15)
    console.log(slicedLinks);// take the top 15 linked words
    slicedLinks.forEach(createSuggestions);        
}
/**End of findSuggestions(data) */

// definitions of functions in findSuggestions(data)
function descendingUniqueSort(toBeSorted) { 
    //sort linked words in descending order
    var hash = new Object();
    toBeSorted.forEach(function (element, index, array) { 
                           if (hash[element] == undefined) {
                               hash[element] = 1;
                           }
                           else {
                               hash[element] +=1;
                           }});
    var itemCounts = new Array();
    for (var key in hash) {
       var itemCount = new Object();
       itemCount.key = key;
       itemCount.count = hash[key];
       itemCounts.push(itemCount);
    }
    itemCounts.sort(function(a,b) { if(a.count<b.count) return 1; 
        else if (a.count>b.count) return -1; else return 0;});

    return itemCounts.map(function(itemCount) { return itemCount.key; });
 }

function createSuggestions(element, index) { 
    //print each suggestions as option to choose
    suggestedID = `suggestion_${index}`
    document.getElementById(suggestedID).innerHTML = element;
}   

/**FUNCTION TO SEARCH THE SUGGESTED WORD */
/** 1. GET THE WORD  
 * 2. GET THE SNIPPET OF THE WORD
*/

function suggestionButton(){ //Search the suggestion
    indexSuggestion = document.getElementById('selectSuggestion').options.selectedIndex;
    suggestionSelected = slicedLinks[indexSuggestion];
    
    displayHistory(suggestionSelected) // update search history

    encodedSuggestion = encodeURI(suggestionSelected)
    let urlforSnip = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedSuggestion}&format=json`
    
    loadJSON(urlforSnip, snipSuggestion, 'jsonp'); //to extract snippet
    
    imageSuggestion = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedSuggestion}&origin=*`;

    loadJSON(imageSuggestion, gotImage, 'jsonp'); // to extract image

    hyperlinkSuggestion = `https://en.wikipedia.org/wiki/${encodedSuggestion}`;
    WikiLink(hyperlinkSuggestion) // to extract hyperlink
}

function snipSuggestion(data){ //get snippet of suggestion
    collectSnippet = data.query.search[0]['snippet'];
    document.getElementById('contentDisplay').innerHTML =collectSnippet + '...'
}
// if sinppet has '.' aka complete sentences, then snippet will end at the last '.' else, add '...'
function completeSentence(content){
    //if (content.match('.') is True) {

}