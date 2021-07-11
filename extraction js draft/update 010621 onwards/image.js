


function imageonly(){

    console.log(allTitlesnPageid)
    index = document.getElementById('optionsSelect').options.selectedIndex;
    selectOptions = allTitlesnPageid[index]
    OptionTitle = selectOptions[0]
    encodedOption = encodeURIComponent(OptionTitle)
    endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*`;
    loadJSON(endpoint, gottheImage, 'jsonp'); //load content
}

function gottheImage(data){ // func req to get image
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
        sampleimageurl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedOption}&format=json`;
        console.log(sampleimageurl)
        
        loadJSON(sampleimageurl, backuptheImage, 'jsonp');
    };
};
    
    
function backuptheImage(data){

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


// if image cannpt wprk, return 0?

