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