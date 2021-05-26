// Fulfill the basic objectives to search for keyword, choose the suggestion and get content in the form of a wikipedia generated code format.
// Had a search history function to allow users to see what they had previously searched for.

let urltoSearch = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let urlforContent = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

function setup() {
    // noCanvas();
    userInput = select("#userinput");
    userInput.changed(startSearch); // why when i just use startsearch, the data cannot be read
    function startSearch(){ // to initiate search
        termTosearch = userInput.value() // what user is searching for
        WikiSearch(termTosearch); //call function
    }

    function WikiSearch(termTosearch) { //use wiki to search
        let urlReadytoSearch = urltoSearch + termTosearch;
        loadJSON(urlReadytoSearch, gotSearch, 'jsonp');
        document.getElementById('wordSearched').innerHTML = termTosearch

    }    

    function gotSearch(data) {
        // IGNORE let len = data[1].length;
        // IGNORE let index = floor(random(len)); -->randomise choice
        let len = data[1].length;
        collectionData = data[1] //global variable
        console.log(len);
        collectionData.forEach(printEach); // to print options on webpg
        function printEach(title, index){ // function to print options
            document.getElementById('options').innerHTML += index +":" + title + '<br>';
        }
        console.log(collectionData); //print list of options in console
    }
}

function someFunction(){
    indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
    console.log(indexSelected)
    selectedTitle = collectionData[indexSelected]
    selectedTitle = selectedTitle.replace('/\s+/g', '_'); // sth todo with changingthe format of the url  to enable      searching through wikipedia (pls correctme if i'm wrong...)
    createDiv(selectedTitle);
    console.log('Querying: ' + selectedTitle); // to show what youaresearching for
    let urlExtractcontent = urlforContent + selectedTitle;
    loadJSON(urlExtractcontent, gotContent, 'jsonp');

    function gotContent(data){
        let page = data.query.pages;
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);
        let content = page[pageID].revisions[0]["*"];
        document.getElementById('contentDisplay').innerHTML =content;
    }
}

