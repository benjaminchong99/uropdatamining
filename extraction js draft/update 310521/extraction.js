let urltoSearch = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let urlforContent = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
//`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`
//let urlforContent = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${selectedTitle}&format=json`



let collectionData = null;
let wordHistory = [];


function setup() {
    // noCanvas();
    userInput = document.getElementById('userinput')
    //userInput = select("#userinput");
    termTosearch = userInput.value
    console.log(userInput.value)
    //userInput.changed(startSearch); // why when i just use startsearch, the data cannot be read
    WikiSearch(termTosearch); //call function

    function WikiSearch(termTosearch) { //use wiki to search
        let urlReadytoSearch = urltoSearch + termTosearch;
        loadJSON(urlReadytoSearch, gotSearch, 'jsonp');

    }    

    function gotSearch(data) { // show user the options available
        
        console.log(data)
        collectionData = data[1] //global variable
        collectionData.forEach(printEach); // to print options on webpg
        function printEach(title, index) { // function to print options
            optionName = `option_${index}`

            document.getElementById(optionName).innerHTML = index +":" + title + '<br>';
        }
        console.log(collectionData); //print list of options in console
    }
}

function someFunction() {
    
    indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
    console.log(indexSelected)
    selectedTitle = collectionData[indexSelected]
    document.getElementById('wordSearched').innerHTML = selectedTitle
    selectedTitle = selectedTitle.replace('/\s+/g', '_'); // sth todo with changingthe format of the url  to enable      searching through wikipedia (pls correctme if i'm wrong...)
    console.log('Querying: ' + selectedTitle); // to show what youaresearching for
    let urlExtractcontent = urlforContent + selectedTitle;
    console.log(urlExtractcontent);
    hyperlink = `https://en.wikipedia.org/wiki/${selectedTitle}`;
    //document.getElementById('getLink').innerHTML = hyperlink;
    WikiLink(hyperlink) //get hyperlink
   
    loadJSON(urlExtractcontent, gotContent, 'jsonp'); //load content
   
    wordHistory.push(selectedTitle);
    document.getElementById('searchedWords').innerHTML = wordHistory; //get wordHistory

    // start of defining functions
    function gotContent(data){
        let page = data.query.pages;        
        //console.log(page);
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);

        let content = page[pageID].revisions[0]["*"];
        startOfContentChar = "'''"
        startCharIndex = content.search(startOfContentChar) + 3;
        console.log(startCharIndex);
        endCharIndex = startCharIndex + 200 + 1;
        description = content.substring(startCharIndex, endCharIndex) + '...'
        document.getElementById('contentDisplay').innerHTML =description;
        //console.log(content);    
        // access summary brute force 
        //let summary = page[pageID].revisions[0]["*"][10];
        //console.log('SUMMARY' + summary);
    }

    function WikiLink(hyperlink) {
        var str = hyperlink;
        var result = str.link(hyperlink);
        document.getElementById("getLink").innerHTML = result;
    }
}

/* ***START OF FOLLOW UP SEARCH*** */

function followUpSearch(){
    followUpWord = 'second' // change this
    findWord(followUpWord);

    function findWord(followUpWord){
        document.getElementById('followUp').innerHTML = followUpWord;
        followUpWord = followUpWord.replace('/\s+/g', '_');
        console.log('Querying: ' + followUpWord); // to show what youaresearching for
    let urlExtractcontent = urlforContent + followUpWord;
    console.log(urlExtractcontent);
    secondhyperlink = `https://en.wikipedia.org/wiki/${followUpWord}`;
    
    WikiLink(secondhyperlink) //get hyperlink

    loadJSON(urlExtractcontent, gotContent, 'jsonp'); //load content
    
    wordHistory.push(followUpWord);
    document.getElementById('searchedWords').innerHTML = wordHistory; //get wordHistory
    }
    
    // start of defining functions
    function gotContent(data){
        let page = data.query.pages;        
        //console.log(page);
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);

        let followUpContent = page[pageID].revisions[0]["*"];
        startOfContentChar = "'''"
        startCharIndex = followUpContent.search(startOfContentChar) + 3;
        console.log(startCharIndex);
        endCharIndex = startCharIndex + 200 + 1;
        secondDescription = followUpContent.substring(startCharIndex, endCharIndex) + '...'
        document.getElementById('secondContentDisplay').innerHTML =secondDescription; 
    }

    function WikiLink(secondhyperlink) {
        var str = secondhyperlink;
        var result = str.link(secondhyperlink);
        document.getElementById("getSecondLink").innerHTML = result; 
    }
}

/*Start of Last FollowUp Search  */

function lastfollowUpSearch() {
    lastfollowUpWord = 'third';
    findLastWord(lastfollowUpWord);

    function findLastWord(lastfollowUpWord){
        document.getElementById('lastFollowUp').innerHTML = lastfollowUpWord;
        lastfollowUpWord = lastfollowUpWord.replace('/\s+/g', '_');
        console.log('Querying: ' + lastfollowUpWord); // to show what youaresearching for
    let urlExtractcontent = urlforContent + lastfollowUpWord;
    console.log(urlExtractcontent);
    
    lasthyperlink = `https://en.wikipedia.org/wiki/${lastfollowUpWord}`;
    WikiLink(lasthyperlink) //get hyperlink

    loadJSON(urlExtractcontent, gotContent, 'jsonp'); //load content
    
    wordHistory.push(lastfollowUpWord);
    document.getElementById('searchedWords').innerHTML = wordHistory; //get wordHistory
    }
    
    // start of defining functions
    function gotContent(data){
        let page = data.query.pages;        
        //console.log(page);
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);

        let lastfollowUpContent = page[pageID].revisions[0]["*"];
        startOfContentChar = "'''"
        startCharIndex = lastfollowUpContent.search(startOfContentChar) + 3;
        console.log(startCharIndex);
        endCharIndex = startCharIndex + 200 + 1;
        secondDescription = lastfollowUpContent.substring(startCharIndex, endCharIndex) + '...'
        document.getElementById('lastContentDisplay').innerHTML =secondDescription;
    }

    function WikiLink(lasthyperlink) {
        var str = lasthyperlink;
        var result = str.link(lasthyperlink);
        document.getElementById("getLastLink").innerHTML = result;
    }
}

