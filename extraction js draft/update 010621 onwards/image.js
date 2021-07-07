

function imageonly(){

    console.log(allTitlesnPageid)
    index = document.getElementById('optionsSelect').options.selectedIndex;
    selectOptions = allTitlesnPageid[index]
    OptionTitle = selectOptions[0]
    encodedOption = encodeURIComponent(OptionTitle)
    endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;
    loadJSON(endpoint, gotImage, 'jsonp'); //load content
}

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
    console.log("url: ", imageplease);
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
        console.log("url: ", imageplease);
        img = document.createElement('img'); 
        img.src = imageplease; 
        document.getElementById('imghtml').src = imageplease;
    
    };
};

