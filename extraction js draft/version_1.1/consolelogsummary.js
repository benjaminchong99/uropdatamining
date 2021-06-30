backendnumofSentences = 2

//define global function to add into summary
//backendimageplease = '' //imageurl
//backendfinaltwoSentences = '' //briefdescription
summary = []
imageurllist = [];

function logSummary() {
    //get key word, two sentences, get page id, get image url, list of suggestions

    optionsAvailable.forEach(eachTermSummary);
    printresults()
}

function printresults() {
    console.log(imageurllist)
}

function eachTermSummary(element, index) {
    term = optionsAvailable[index]['title'];
    Sumpageid = optionsAvailable[index]['pageid']
    backendimageplease = ''
    backendfinaltwoSentences = ''


    encodedterm = encodeURIComponent(term)
    backendimageurl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedterm}&origin=*`
    loadJSON(backendimageurl, findpicture, 'jsonp')


}

function backendimgsrc() {

}

function backendSuggestions() {

}

function backendtwosentences() {

}

function logging(term, Sumpageid, trueExtract, image_url, list_of_suggestions) {
    the_log = {
        'title': term,
        'pageid': Sumpageid,
        'briefdescription': trueExtract,
        'image url': image_url,
        'list of suggestions': list_of_suggestions
    }
    summary.push(the_log)
}

function findpicture(data) {
    myJSON = JSON.stringify(data);
    console.log(myJSON);
    backendimageplease = '';
    startofURL = myJSON.search('https');
    endofURL = myJSON.search('.jpg');
    if (startofURL === -1 || endofURL === -1) {

    } else {
        backendimageplease = myJSON.substring(startofURL, endofURL + 4);
    };
    console.log(backendimageplease);

    if (backendimageplease === '') {
        console.log("Find backup image");
        checkTitleStart = myJSON.indexOf('"title":');
        filterTitle = myJSON.substring(checkTitleStart + 9, myJSON.length);
        checkTitleEnd = filterTitle.indexOf('"');
        checkTitle = filterTitle.substring(0, checkTitleEnd);
        console.log(checkTitle);

        encodedWordAgain = encodeURIComponent(checkTitle);
        backupImage(encodedWordAgain);
    };
    imageurllist.push(backendimageplease)
};


function backupImage(encodedWordAgain) {
    console.log('Finding backup image')
    sampleimageurl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedWordAgain}&format=json`;

    loadJSON(sampleimageurl, getimg, 'jsonp');

    function getimg(data) {
        myDump = JSON.stringify(data);

        lolsStart = myDump.indexOf('//upload');
        lolsEnd = myDump.search(/\.(png|jpg|JPEG|svg)\\("\)|" decoding)/i);
        url = myDump.substring(lolsStart + 2, lolsEnd + 4);
        console.log(lolsStart, lolsEnd);
        console.log(url);
        backendimageplease = `https://${url}`;

    };
};


function backendtwoSentences(term) {
    const sentenceAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=${backendnumofSentences}&exlimit=1&titles=${term}&explaintext=1&formatversion=2&format=json`;

    console.log(sentenceAPI);
    loadJSON(sentenceAPI, getbackendTwoSentences, 'jsonp');
}


function getbackendTwoSentences(data) {
    backendfinaltwoSentences = data.query.pages[0]['extract'];
}