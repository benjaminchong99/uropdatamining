let optionsAvailable = null;
let wordHistory = [];
let wordHistoryLinked = [];
let listSuggestions = [];
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
    test = suggestionSelected.match(/\|/g);
    
    if (test === null) {

    }else{
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
    if (listSuggestions[listSuggestions.length-1] ===suggestionSelected){

    }else if (wordHistory[wordHistory.length-1] ===suggestionSelected + ' '){

    }else{
        suggestionSelectedLinked = suggestionSelected.link(hyperlinkSuggestion)
        listSuggestions.push(suggestionSelected);
        listSuggestionsLinked.push(suggestionSelectedLinked);
        document.getElementById('listSuggest').innerHTML = listSuggestionsLinked
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
    document.getElementById('searchedWords').innerHTML = wordHistoryLinked 
    document.getElementById('listSuggest').innerHTML = listSuggestionsLinked
    document.getElementById('wordSearched').innerHTML = ''
}



/** version 2 */
function createInfobox(inputphrase){
    wordInfobox = inputphrase
    //wordInfobox = document.getElementById('wordSearched')
    console.log(wordInfobox)
    encodedwordInfobox = encodeURIComponent(wordInfobox)
    urlGetPageid = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedwordInfobox}&format=json`
    console.log(urlGetPageid)
    loadJSON(urlGetPageid, infoboxPageid, 'jsonp')
}

function infoboxPageid(data) {
    findingPageid = JSON.stringify(data)
    console.log(findingPageid)
    pageidStart = findingPageid.indexOf('"pageid":')
    pageidEnd = findingPageid.indexOf('"ns":')
    console.log(pageidStart, pageidEnd)
    finallyPageid = findingPageid.substring(pageidStart+9, pageidEnd-1)
    console.log('in function: ',finallyPageid)
    runTable(finallyPageid)
}

function runTable(finallyPageid){
    urlFindTable = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${finallyPageid}&section=0&prop=wikitext&format=json`
    console.log('running test', urlFindTable)
    loadJSON(urlFindTable, infoboxContent, 'jsonp')
}

function infoboxContent(data){
    myInfoboxstr = JSON.stringify(data)
    infoboxStart = myInfoboxstr.indexOf('{Infobox')
    infoboxEnd = myInfoboxstr.search(/\\n\}\}(\s+|\\n)(\W+''|\W\w+''|\W\w\W+''|<|\\n\w|\{\{Infobox)|\\n\\n'''/g) 
    /**VERY IMPORTANT REGEX HERE! */
    console.log(infoboxStart, infoboxEnd)
    myInfobox = myInfoboxstr.substring(infoboxStart, infoboxEnd+3)
    console.log(myInfobox)

    /**HERE ONNWARDS IS CREATION OF INFOTABLE */
    if (infoboxStart === -1| infoboxEnd === -1){
            thegoldenTable = document.getElementById('infoTable')
            thegoldenTable.innerHTML=''
            nothingRow = thegoldenTable.insertRow(0)
            nothingRow.innerHTML ="No infobox available"
            console.log("If you expected sth, go check the api") // for checking
        
    } else{
        /** SECTION TO FIND TITLES AND VALUES FOR THE INFOBOX */
        startingPoint = myInfobox.indexOf("\\n|")
        myInfobox = myInfobox.substring(startingPoint+4,myInfobox.length)
        
        listofCategories = []

        /**Step below: loop to find "\n|" one by one until there's none left */
        while (myInfobox.search(/\\n\|/g) != -1){
            endCat = myInfobox.indexOf("\\n|")
            one_cat = myInfobox.substring(0,endCat+3)
            listofCategories.push(one_cat)
            myInfobox = myInfobox.replace(one_cat,"")
        }

        if (myInfobox.length != 0){
            listofCategories.push(myInfobox)
        }
        console.log('Categories: ', listofCategories)
        /** EMERGENCY CHECK: UP TILL HERE IT IS STILL CORRECT */

        listTitles = []
        listValues = []
        for (i=0; i<listofCategories.length; i++) {
            findTitles = listofCategories[i].match(/\w+\s+=/g)
            findValues = listofCategories[i].replace(findTitles[0],'')
            a_Value = findValues.substring(0,findValues.length-2)

            listTitles.push(findTitles[0].replace(/\s+=/g, ''))
            listValues.push(a_Value)
        }
        console.log('Titles: ', listTitles)
        console.log('Values: ', listValues)

        /** EMERGENCY CHECK: CHECK UP TILL THIS PORTION */
        /**KIV THIS, MIGHT BE REDUDANT */
        while (listValues.includes('')) {
            removeindex = listValues.indexOf('')
            listValues.pop(listValues[removeindex])
            listTitles.pop(listTitles[removeindex])
        }
        /** */
        /**CLEANING BELOW */
        for (i = 0; i < listTitles.length; i++) {
            /**cleaning title */
            if (listTitles[i].includes('_') == true) {
                listTitles[i] = listTitles[i].replace('_', ' ')
            }
            
            /**cleanning values */
            listValues[i] = listValues[i].replace(/(\{\{\w+\|)/g, '')
            listValues[i] = listValues[i].replace(/([\\\[\]\{\}])/g, '')
            //listValues[i] = listValues[i].substring(/\w.*/g)
            listValues[i] = listValues[i].replace("n*", '')
            callstop = false
            while (callstop == false) {
                if (listValues[i].indexOf("n*") != -1){
                    listValues[i] = listValues[i].replace("n*", '; ')
                } else{
                    callstop = true
                }
            }
        }

        //cleanedlistValues = []
        //listValues.forEach(element => {
        //    cleanedlistValues.push(element.replace( /(^.*\[|\].*$)/g, ''))
        //    // (^.*\[|\].*$
        //})
        //console.log(cleanedlistValues)

        console.log(listTitles)
        console.log(listValues)
        thegoldenTable = document.getElementById('infoTable')
        thegoldenTable.innerHTML=''

        for (i=0; i<listTitles.length; i++){ 
            if (listValues[i]===''){
                //pass
            } else{
                rowName = `row${i}`
                row = thegoldenTable.insertRow(-1)
                cell1 = row.insertCell(0)
                cell1.setAttribute('id', 'Title')
                cell2 = row.insertCell(1)
                cell1.innerHTML = listTitles[i]
                cell2.innerHTML = listValues[i]
            }
        }
        
        if (thegoldenTable.rows[0].cells[0].innerHTML === 'Categories'){
            //pass
        }else {
            row = thegoldenTable.insertRow(0)
            header1 = row.insertCell(0)
            header2 = row.insertCell(1)
            header1.innerHTML = "Categories"
            header2.innerHTML = "Details"
        }

    }
}

// todo: need to remove unnecessary symbols from infobox values
