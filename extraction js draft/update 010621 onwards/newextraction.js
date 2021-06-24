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



/**GROUP 2: SEARCH THE TERM */
// SEARCH SELECTED TERM FROM OPTIONS AVAILABLE
function goldenButton(){
    indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
    selectedOption = optionsAvailable[indexSelected];
    OptionTitle = selectedOption['title'];
    listSuggestions = [];
    console.log(selectedOption); // END OF SELECTING OPTION

    pageID = selectedOption['pageid'];

    /** SECTION FOR URL related works */
    document.getElementById('wordSearched').innerHTML = selectedOption['title'];
    
    encodedOption = encodeURIComponent(selectedOption['title']); //encode word into url readable format

    /**SECTION FOR TWO SENTENCES */
    twoSentences(encodedOption);

    /**SECTION FOR INFOBOX */
    createInfobox(OptionTitle)
    
    /** SECTION FOR HYPERLINK */
    hyperlink = `https://en.wikipedia.org/wiki/${encodedOption}`;

    /** SECTION FOR SEARCH HISTORY */
    displayHistory(OptionTitle, hyperlink);

    /** SECTION TO GET IMAGE */
    endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;

    loadJSON(endpoint, gotImage, 'jsonp'); //load content

    /** SECTION TO GET SUGGESTIONS*/
    getSuggestions(encodedOption); // get suggestions in the second box
}


//Start of all defintiions of functions required in goldenButton() 


/**recurring function */
function displayHistory(OptionTitle, hyperlink) {
    if (wordHistory.includes(OptionTitle + ' ')=== true){
        console.log('running omit')
    } else {
        OptionTitleLinked = OptionTitle.link(hyperlink);
        wordHistory.push(OptionTitle + ' ')
        wordHistoryLinked.push(OptionTitleLinked + ' ');
        document.getElementById('searchedWords').innerHTML = wordHistoryLinked; //get wordHistory
    }
}


/**recurring function */
function twoSentences(word){
    const sentenceAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&titles=${word}&explaintext=1&formatversion=2&format=json`;

    console.log(sentenceAPI);
    loadJSON(sentenceAPI, getTwoSentences, 'jsonp');    
}


function getTwoSentences(data) {
    console.log(data);
    finaltwoSentences = data.query.pages[0]['extract'];
    document.getElementById('contentDisplay').innerHTML = finaltwoSentences;
}


/**recurring function */
function gotImage(data){ // func req to get image
    myJSON = JSON.stringify(data);
    console.log(myJSON);
    imageplease = '';
    startofURL = myJSON.search('https');
    endofURL = myJSON.search('.jpg');
    if (startofURL === -1 || endofURL === -1){

    } else{
        imageplease = myJSON.substring(startofURL, endofURL+4);
    };
    console.log(imageplease);
    img = document.createElement('img'); 
    img.src = imageplease; 
	document.getElementById('imghtml').src = imageplease;

    if (imageplease === ''){
        console.log("Find backup image");
        checkTitleStart = myJSON.indexOf('"title":');
        filterTitle = myJSON.substring(checkTitleStart+9, myJSON.length);
        checkTitleEnd = filterTitle.indexOf('"');
        checkTitle = filterTitle.substring(0,checkTitleEnd);
        console.log(checkTitle);
        
        encodedWordAgain = encodeURIComponent(checkTitle);
        backupImage(encodedWordAgain);
    };
};


function backupImage(encodedWordAgain){
    console.log('Finding backup image')
    sampleimageurl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedWordAgain}&format=json`;

    loadJSON(sampleimageurl, getimg, 'jsonp');

    function getimg(data){
        myDump = JSON.stringify(data);

        lolsStart = myDump.indexOf('//upload');
        lolsEnd = myDump.search(/\.(png|jpg|JPEG|svg)\\("\)|" decoding)/i);
        url = myDump.substring(lolsStart+2,lolsEnd+4);
        console.log(lolsStart, lolsEnd);
        console.log(url);
        imageplease = `https://${url}`;
        img = document.createElement('img'); 
        img.src = imageplease; 
	    document.getElementById('imghtml').src = imageplease;
    
    };
};


/**recurring function */
function getSuggestions(encodedOption){ 
    // req to get suggestions by finding freq appeared words in full content
    urlSuggestions =`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`;

    loadJSON(urlSuggestions, findSuggestions, 'jsonp'); //load full content of selected option
}


function findSuggestions(data){
    helloSuggestions = JSON.stringify(data);

    // find all suggested words in full content
    let links = helloSuggestions.match(/\[\[([^\]]*)\]\]/g);
    cleanedLinks = [];
    links.forEach(element => {
        cleanedLinks.push(element.replace( /(^.*\[|\].*$)/g, ''));
    });
    slicedLinks = [];
    slicedLinks = descendingUniqueSort(cleanedLinks).slice(0,15);
    console.log(slicedLinks);// take the top 15 linked words
    slicedLinks.forEach(createSuggestions);        
}
/**End of findSuggestions(data) */


function descendingUniqueSort(toBeSorted) { 
    //required to sort linked words in descending order
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
};


function createSuggestions(element, index) { 
    //print each suggestions as option to choose
    suggestedID = `suggestion_${index}`;
    document.getElementById(suggestedID).innerHTML = element;
};


/*** END OF GROUP 2: SEARCH THE TERM
 * SHOULD HAVE PROVIDED THE RESULTS, IMAGE, SEARCH HISTORY, HYPERLINK
 */



/**GROUP 3: SEARCH THE SUGGESTED WORD */
function suggestionButton(){ //Search the suggestion
    indexSuggestion = document.getElementById('selectSuggestion').options.selectedIndex;
    suggestionSelected = slicedLinks[indexSuggestion];
    document.getElementById('wordSearched').innerHTML = suggestionSelected;
    runTestandSearch(suggestionSelected);
};

function runTestandSearch(suggestionSelected){
    if (suggestionSelected.includes("|")){
        indextoRemove = suggestionSelected.indexOf('|');
        suggestionSelected = suggestionSelected.substring(0,indextoRemove);
    };
    encodedSuggestion = encodeURIComponent(suggestionSelected);
    console.log('Querying: ' +suggestionSelected, encodedSuggestion);
    twoSentences(encodedSuggestion);
    createInfobox(suggestionSelected)
    
    imageSuggestion = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedSuggestion}&origin=*`;
    
    loadJSON(imageSuggestion, gotImage, 'jsonp'); // to extract image
    
    hyperlinkSuggestion = `https://en.wikipedia.org/wiki/${encodedSuggestion}`;
    displaySuggestion(suggestionSelected, hyperlinkSuggestion); // update search history

    getSuggestions(encodedSuggestion);
}


function displaySuggestion(suggestionSelected, hyperlinkSuggestion) {
    console.log(wordHistory)
    if (listSuggestions.includes(suggestionSelected) ===true){

    }else if (wordHistory[wordHistory.length-1] ===suggestionSelected + ' '){

    }else{
        suggestionSelectedLinked = suggestionSelected.link(hyperlinkSuggestion)
        listSuggestions.push(suggestionSelected);
        if (suggestionHistory.includes(suggestionSelected)===true){

        } else{
            suggestionHistory.push(suggestionSelected);
            listSuggestionsLinked.push(suggestionSelectedLinked);    
        };
        document.getElementById('listSuggest').innerHTML = listSuggestionsLinked;
    }
}

/*** END OF GROUP 3: SEARCH SUGGESTED WORD
 * SHOULD HAVE PROVIDED SUGGESTED RESULT, UPDATE ORD HISTORY, UPDATE HYPERLINK, CHANGE CURRENT BOX INTO A LIST OF NEW SUGGESTIONS 
 ***/

function previousButton(){
    // this function should allow user to go back to the previous suggestion to find out more
    listSuggestions.pop();
    if (listSuggestions.length < 1){
        console.log("empty")
        runTestandSearch(OptionTitle)
        listSuggestions = []
        document.getElementById('wordSearched').innerHTML = OptionTitle
    } else{
        lastTerm = listSuggestions.length -1
        console.log(listSuggestions.length)
        prevSelection = listSuggestions[lastTerm]
        document.getElementById('wordSearched').innerHTML = prevSelection
        runTestandSearch(prevSelection)
    }
}

function clearHistory(){
    wordHistory = [];
    wordHistoryLinked = [];
    listSuggestions = [];
    listSuggestionsLinked = [];
    suggestionHistory = [];
    document.getElementById('searchedWords').innerHTML = wordHistoryLinked 
    document.getElementById('listSuggest').innerHTML = listSuggestionsLinked
    document.getElementById('wordSearched').innerHTML = ''
}



