function jsononly() {


console.log(allTitlesnPageid)
console_logJSON()
index = document.getElementById('optionsSelect').options.selectedIndex;
selectOptions = allTitlesnPageid[index]
OptionTitle = selectOptions[0]
pageID = selectOptions[1]
console.log('!!!NOTE: PLEASE WAIT FOR JSON TO LOAD BEFORE CLICKING ANY BUTTON...')


 /** SECTION FOR URL related works */
 encodedOption = encodeURIComponent(OptionTitle) //encode word into url readable format


 /**SECTION FOR TWO SENTENCES */
 twoSentences(encodedOption);


 /**SECTION FOR INFOBOX */
 createInfobox(OptionTitle)
 

 /** SECTION FOR HYPERLINK */
 hyperlink = `https://en.wikipedia.org/wiki/${encodedOption}`;


 /** SECTION TO GET IMAGE */
 endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;
 loadJSON(endpoint, gotImage, 'jsonp'); //load content


 /** SECTION TO GET SUGGESTIONS*/
 getSuggestions(encodedOption); // get suggestions in the second box

}

function getJSONFile() {
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

function getmultipleJSON() {    
    console.log(collectionJSON)
}