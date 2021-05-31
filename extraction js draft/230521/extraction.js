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
        var collectionData = data[1]
        console.log(len);
        let counter = 0;
        //var allTitles = []
        //while (counter < len) {
        //    var title = data[1][counter]; // chose the first suggestion on the list
        //    counter +=1 ;        
        //    allTitles.push(title)
        //}        
        collectionData.forEach(printEach); // to print options on webpg
        function printEach(title, index){ // function to print options
            document.getElementById('options').innerHTML += index +":" + title + '<br>';
        }
        console.log(collectionData); //print list of options in console

        //indexSelected = document.getElementById('optionsSelect').options.selectedIndex;
        //console.log(indexSelected)
        selectedTitle = collectionData[0]
        selectedTitle = selectedTitle.replace('/\s+/g', '_'); // sth todo with changing the format of the url  to enable      searching through wikipedia (pls correct me if i'm wrong...)
        createDiv(selectedTitle);
        console.log('Querying: ' + selectedTitle); // to show what youaresearching for
        let urlExtractcontent = urlforContent + selectedTitle;
        loadJSON(urlExtractcontent, gotContent, 'jsonp');
    }

    function gotContent(data){
        let page = data.query.pages;
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);
        let content = page[pageID].revisions[0]["*"];
        document.getElementById('contentDisplay').innerHTML =content;
    }
}


