/**GROUP 3: SEARCH THE SUGGESTED WORD */
function suggestionButton(){ //Search the suggestion
    indexSuggestion = document.getElementById('selectSuggestion').options.selectedIndex;
    suggestionSelected = slicedLinks[indexSuggestion];
    document.getElementById('wordSearched').innerHTML = suggestionSelected;
    runTestandSearch(suggestionSelected);
};


function runTestandSearch(suggestionSelected){
    if (suggestionSelected.indexOf("|") != -1){ // remove the category part that may have been tagged with the phrase
        indextoRemove = suggestionSelected.indexOf('|');
        suggestionSelected = suggestionSelected.substring(0,indextoRemove);
    };

    encodedSuggestion = encodeURIComponent(suggestionSelected);
    console.log('Querying: ' +suggestionSelected, encodedSuggestion);

    
    /**create the brief description */
    twoSentences(encodedSuggestion);
    
    
    /** create infobox */
    createInfobox(suggestionSelected);
    

    /** create image  */
    imageSuggestion = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedSuggestion}&origin=*`;
    loadJSON(imageSuggestion, gotImage, 'jsonp'); // to extract image
    
    /**crate linked suggestion history */
    hyperlinkSuggestion = `https://en.wikipedia.org/wiki/${encodedSuggestion}`;
    displaySuggestion(suggestionSelected, hyperlinkSuggestion); // update search history


    /** create suggestions */
    getSuggestions(encodedSuggestion);

    
    /** create JSON */
    OptionTitle = suggestionSelected;
    hyperlink = hyperlinkSuggestion;
    pageID = finallyPageid

    console_logJSON()
    console.log('!!!NOTE: PLEASE WAIT FOR JSON TO LOAD BEFORE CLICKING ANY BUTTON...')
}


function displaySuggestion(suggestionSelected, hyperlinkSuggestion) {
    console.log(wordHistory)
    if (listSuggestions.includes(suggestionSelected) ===true){
        // check for repeated words, if so then pass
    }else if (wordHistory[wordHistory.length-1] ===suggestionSelected + ' '){
        // check if word exist in the main search, if so then pass
    }else{
        suggestionSelectedLinked = suggestionSelected.link(hyperlinkSuggestion)
        listSuggestions.push(suggestionSelected);
        if (suggestionHistory.includes(suggestionSelected)===true){
            // check for repeated words, if so then pass
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


/**Additional functions */
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

function refreshSelection(){
    // this function allow users to refresh the search in case the information is not displayed properly
    refreshWord = document.getElementById('wordSearched').innerHTML
    console.log("Refreshing: ", refreshWord)
    runTestandSearch(refreshWord)
}