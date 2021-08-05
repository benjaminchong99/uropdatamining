function infoboxElement(){
    
    wordInfobox = document.getElementById('wordSearched').innerHTML;
    console.log(wordInfobox);
    lowercasewordInfobox = wordInfobox.toLowerCase();
    encodedwordInfobox = encodeURIComponent(lowercasewordInfobox);
    urlGetPageidElement = `https://en.wikipedia.org/w/api.php?action=query&titles=Template:Infobox_${encodedwordInfobox}&format=json`;
    console.log(urlGetPageid);
    loadJSON(urlGetPageidElement, infoboxElementPageid, 'jsonp');
};

function infoboxElementPageid(data) {
    //get pageid
    findingPageid = JSON.stringify(data);
    console.log(findingPageid);
    pageidStart = findingPageid.indexOf('"pageid":');
    pageidEnd = findingPageid.indexOf('"ns":');
    console.log(pageidStart, pageidEnd);
    finallyPageid = findingPageid.substring(pageidStart+9, pageidEnd-1);
    console.log('in function: ',finallyPageid);
    runElementTable(finallyPageid);
};

function runElementTable(finallyPageid){
    urlFindTable = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${finallyPageid}&prop=wikitext&format=json`;
    console.log('running test', urlFindTable);
    loadJSON(urlFindTable, checkElementExistence, 'jsonp');
};

// try finding page id first, maybe it'll be faster and not result in timeout
function checkElementExistence(data){
    myInfoboxstr = JSON.stringify(data);
 
    elementboxStart = myInfoboxstr.indexOf(/\{[Ii]nfobox element/g);
    elementboxEnd = myInfoboxstr.indexOf('<!--');
    buildInfobox(elementboxStart+16, elementboxEnd-3);
    console.log("infobox element");
};

/** INFOBOX ELEMENTS, MORE SPECIFIC ONES */