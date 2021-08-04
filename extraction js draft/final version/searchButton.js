// to modify and control
let numofSentences = 2;
let numofSuggestions = 15;

// store information for json format
let collectionJSON = {};
let finaltwoSentences = '';
let imageplease = '';
let slicedLinks = '';
let infobox_json = '';
//let OptionTitle = '';
//let hyperlink = '';

/**GROUP 2: SEARCH THE TERM */
// SEARCH SELECTED TERM FROM OPTIONS AVAILABLE
function searchButton(){
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
    

    /** SECTION FOR POSSIBLE OUTLINE */
    possibleOutline(OptionTitle)

    /** SECTION TO GET JSON */
    console.log(allTitlesnPageid)
    console_logJSON()
    console.log('!!!NOTE: PLEASE WAIT FOR JSON TO LOAD BEFORE CLICKING ANY BUTTON...')
};


/** await async function */
function resolveJSON(){
    return new Promise(resolve => { 
        setTimeout(() => {
            resolve(getJSONFile());
        }, 5000);
        })
}
//setTimeout(() => {   console.log('Please wait patiently as the json format is generating...'); }, 4000);
async function console_logJSON(){
    console.log('running JSON')
    await resolveJSON()
}


/** Start of all defintiions of functions required in searchButton() */ 


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


function twoSentences(word){
    const sentenceAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=${numofSentences}&exlimit=1&titles=${word}&explaintext=1&formatversion=2&format=json`;

    console.log(sentenceAPI);
    loadJSON(sentenceAPI, getTwoSentences, 'jsonp');    
}


function getTwoSentences(data) {
    console.log(data);
    finaltwoSentences = data.query.pages[0]['extract'];
    document.getElementById('contentDisplay').innerHTML = finaltwoSentences;
}


function gotImage(data){ // function required to get image
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


function backupImage(encodedWordAgain){ // if gotImage(data) fails, this function will help to give an image
    console.log('Finding backup image')
    sampleimageurl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedWordAgain}&format=json`;

    loadJSON(sampleimageurl, getimg, 'jsonp');

    function getimg(data){
        myDump = JSON.stringify(data);

        backupStart = myDump.indexOf('//upload');
        backupEnd = myDump.search(/\.(png|jpg|JPEG|svg)\\("\)|" decoding)/i); //filtering possible end of file name
        url = myDump.substring(backupStart+2,backupEnd+4);
        console.log(backupStart, backupEnd);
        console.log(url);
        imageplease = `https://${url}`;
        img = document.createElement('img'); 
        img.src = imageplease; 
	    document.getElementById('imghtml').src = imageplease;
    
    };
};


function getSuggestions(encodedOption){ 
    // req to get suggestions by finding freq appeared words in full content
    const urlSuggestions =`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`;

    loadJSON(urlSuggestions, findSuggestions, 'jsonp'); //load full content of selected option
}


function findSuggestions(data){
    helloSuggestions = JSON.stringify(data);

    // find all suggested words in full content
    let links = helloSuggestions.match(/\[\[([^\]]*)\]\]/g);
    cleanedLinks = [];
    links.forEach(element => {
        cleanedLinks.push(element.replace( /(^.*\[|\].*$)/g, '')); //clean unnecessary symbols
    });
    slicedLinks = [];
    slicedLinks = descendingUniqueSort(cleanedLinks).slice(0,numofSuggestions);
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

function getJSONFile() { //repackage search result into JSON file
    searchedJSON = {
        "searchTerm": OptionTitle,
        "page id": pageID,
        "description": finaltwoSentences,
        "image url": imageplease,
        "infobox": infobox_json,
        "wikipedia page": hyperlink,
        "suggestions available": slicedLinks
    };
    
    console.log("YOUR SEARCH IN JSON: ",searchedJSON);
    repeatedTitle = false
    for (i=0; i<collectionJSON.length; i++) {
        if (collectionJSON[i] == OptionTitle) {
            console.log("repeated")
            repeatedTitle = true;
        }
    }

    if (repeatedTitle == true) {
        // pass
    } else {
        collectionJSON[OptionTitle] =searchedJSON
    }
    // convert JSON object to string
    //const JSONdata = JSON.stringify(searchedJSON);
    //console.log("your search in json: ", JSONdata);

}

function justJSON() {
    console.log(searchedJSON);
}

function getmultipleJSON() { //get collection of multiple searches in json
    console.log(collectionJSON);
}

/*** END OF GROUP 2: SEARCH THE TERM
 * SHOULD HAVE PROVIDED THE RESULTS, IMAGE, SEARCH HISTORY, HYPERLINK
 */