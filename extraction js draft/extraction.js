let urltoSearch = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let urlforContent = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

function setup() {
    // noCanvas();
    userInput = select("#userinput");
    userInput.changed(startSearch);    
}

    function startSearch(){ // to initiate search
        termTosearch = userInput.value() // what user is searching for
        WikiSearch(termTosearch); //call function
    }

    function WikiSearch(termTosearch) { //use wiki to search
        let urlReadytoSearch = urltoSearch + termTosearch;
        loadJSON(urlReadytoSearch, gotSearch, 'jsonp');
    }    

    function gotSearch(data) {
        // IGNORE let len = data[1].length;
        // IGNORE let index = floor(random(len)); -->randomise choice
        console.log('Do you mean: ' + data);
        var title = data[1][0] // chose the first suggestion on the list
        title = title.replace('/\s+/g', '_'); // sth to do with changing the format of the url to enable searching through wikipedia (pls correct me if i'm wrong...)
        createDiv(title);
        console.log('Querying: ' + title); // to show what you aresearching for
        let urlExtractcontent = urlforContent + title
        loadJSON(urlExtractcontent, gotContent, 'jsonp')        
    }

    function gotContent(data){
    let page = data.query.pages;
        let pageID = Object.keys(data.query.pages)[0];
        console.log(pageID);
        let content = page[pageID].revisions[0]["*"];
        console.log(content) // to print content
    }