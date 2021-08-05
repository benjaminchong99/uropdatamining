function possibleOutline(OptionTitle) { //take current option and find possible Outline topics
    keyword = OptionTitle;
    if (keyword.indexOf("Outline of")==0) { // if original search is on outline then ignore reformatting
        keyword = keyword.replace("Outline of", "");
    };
    keyword = keyword.toLowerCase();
    outlinepossibilities = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Outline_of_${keyword}&format=json`
    loadJSON(outlinepossibilities, showOutlineOptions, 'jsonp');
};

function showOutlineOptions(data){
    // push only options with outline
    search = data.query.search;
    console.log(search);
    finaloutline = []; //reset
    search.forEach(element => {
        outlinetitle = element['title'];
        if (outlinetitle.indexOf('Outline of') != -1){
            finaloutline.push(outlinetitle);
        };
    });
    console.log(finaloutline); // list of Outline of __

    for (k=0; k<10; k++) { //reset
    documentid = `outline_${k}`;
    document.getElementById(documentid).innerHTML = '';
    };
    
    for (i=0; i<finaloutline.length; i++) { //show options on page
        documentid = `outline_${i}`;
        document.getElementById(documentid).innerHTML = finaloutline[i];
    };

};

function outlineonly() { //start of constructing outline
    
    indexkeyword = document.getElementById('selectOutline').options.selectedIndex;
    selectedOutline = finaloutline[indexkeyword];
    //console.log(selectedOutline)
    outlineapirequired =`https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${selectedOutline}&format=json`;
    console.log(outlineapirequired);
    loadJSON(outlineapirequired,showoutine,'jsonp');

};


function showoutine(data) {
    showdata = JSON.stringify(data);
    newdata = showdata.substring(showdata.indexOf('\\n=='), showdata.length);
    console.log(newdata); //raw json


    headers_index = [];
    temp_contentunderheader = [];
    contentunderheader = [];
    
    //find header to header; between headers is the content
    list_of_headers = newdata.match(/(\\n==)+[\w\s]+==/g);
    list_of_headers.forEach(element => {
        singleindex = newdata.indexOf(element);
        headers_index.push(singleindex);//indexes where headers are
    });
    console.log(list_of_headers);
    console.log(headers_index);

    for (i=0; i< headers_index.length; i++) {
        partialsection = newdata.substring(headers_index[i],headers_index[i+1]);
        temp_contentunderheader.push(partialsection); // split into the different contents
    };
    console.log(temp_contentunderheader);

    temp_contentunderheader.forEach(element => {
        splittedcontent = element.split(/\\n\*|\\n/g);
        console.log(splittedcontent);
        truesplittedcontent = [];
        splittedcontent[1] = splittedcontent[1].replace(/=/g, "");
        for (j=0; j<splittedcontent.length; j++) {
            splittedcontent[j] = splittedcontent[j].replace(/[\[\]]/g, "");
            if (splittedcontent[j] == ''){

            } else {
                truesplittedcontent.push(splittedcontent[j]);
            };
        };
        contentunderheader.push(truesplittedcontent);
    });

    console.log('spliced: ', contentunderheader); // first filter to make sure no empty list

    listofheaders = []; // for test
    contentunderheader.forEach(element => {
        console.log(element);
        header = element[0];
        listofheaders.push(header); // for test

    });

    testJSON = {};
    console.log(listofheaders);
    
    for (i=0; i<contentunderheader.length; i++) {
        element = contentunderheader[i]; // up till here still looks correct
        
        headers = [];
        content = [];
        subcontent = [];
        subsubcontent = [];
        subx3content = [];

        for (j=0; j<element.length; j++){
            console.log(element[j]);
            checksubcontent1 = element[j].search(/#\s/g); //check for "# " with space
            checksubcontent2 = element[j].search(/\*\s/g); //check for "* " with space
            checksubsubcontent = element[j].search(/#\*\s/g); //check for "#* " with space
            checksubsubcontent2 = element[j].search(/\*\*/g);//check for "#* " with space
            checksubx3content= element[j].search(/#\*\*\s/g); //check for "#** " with space
            checksubx3content2 = element[j].search(/\*\*\*/g); //check for "#** " with space
  
            currentsubcontent = Object.keys(subcontent)[Object.keys(subcontent).length -1];
            currentsubsubcontent = Object.keys(subsubcontent)[Object.keys(subsubcontent).length -1];



            if (checksubsubcontent == 0|| checksubsubcontent2 == 0) { //check #*
                subx3content = []; //reset subx3content
                addsubsubcontentjson = {};
                addsubsubcontentjson[element[j]] = {};
                subsubcontent.push(addsubsubcontentjson);
                
                //model
                subcontentJSON = testJSON[listofheaders[i]][currentcontent][currenttempobj];
                currentsubcontent = Object.keys(subcontentJSON)[Object.keys(subcontentJSON).length -1];
                tempsubobj = testJSON[listofheaders[i]][currentcontent][currenttempobj][subcontent.length-1];
                currenttempsubobj = Object.keys(tempsubobj)[Object.keys(tempsubobj).length -1];
                testJSON[listofheaders[i]][currentcontent][currenttempobj][currentsubcontent][currenttempsubobj] = subsubcontent;
                

            } else if (checksubx3content == 0|| checksubx3content2 == 0) { //check #**
                addsubx3contentjson = {};
                addsubx3contentjson[element[j]] = {};
                subx3content.push(addsubx3contentjson);

                subsubcontentJSON = testJSON[listofheaders[i]][currentcontent][currenttempobj][currentsubcontent][currenttempsubobj];
                currentsubsubcontent = Object.keys(subsubcontentJSON)[Object.keys(subsubcontentJSON).length -1];
                tempsubsubobj = testJSON[listofheaders[i]][currentcontent][currenttempobj][currentsubcontent][currenttempsubobj][subsubcontent.length-1];
                currenttempsubsubobj = Object.keys(tempsubsubobj)[Object.keys(tempsubsubobj).length -1];
                testJSON[listofheaders[i]][currentcontent][currenttempobj][currentsubcontent][currenttempsubobj][currentsubsubcontent][currenttempsubsubobj] = subx3content;
                            
            } else if (checksubcontent1 == 0||checksubcontent2 == 0) { //check # , check *
                subsubcontent = []; //reset subsubcontent
                addsubcontentjson = {};
                addsubcontentjson[element[j]] = {};
                subcontent.push(addsubcontentjson);

                //model
                contentJSON = testJSON[listofheaders[i]]; //list
                currentcontent = Object.keys(contentJSON)[Object.keys(contentJSON).length-1]; //last index of the content under the header; JSON
                tempobj = testJSON[listofheaders[i]][content.length-1]; // content, last index layer below the header
                currenttempobj = Object.keys(tempobj)[Object.keys(tempobj).length-1]; // key 
                testJSON[listofheaders[i]][currentcontent][currenttempobj] = subcontent; 
                //json[key, header][last index of the value(array) under key,header][key of the value] = value of the value

            } else if (checksubcontent1 == -1 || checksubcontent2 == -1) {
                subcontent = []; //reset subcontent
                addheader = {};
                addheader[listofheaders[i]] = {};
                headers.push(addheader);
                //console.log(headers)
                
                addcontentjson = {};
                addcontentjson[element[j]] = {};
                content.push(addcontentjson);

                
                currentheader = Object.keys(testJSON)[Object.keys(testJSON).length - 1];
                tempheader = testJSON;
                testJSON[listofheaders[i]] = content;
                
                
            };

        };
    };

    outlinetable = document.getElementById('outline');
    outlinetable.innerHTML ='';
    splicedJSON = {};
    listofheaders = []; // for test
    contentunderheader.forEach(element => {
        console.log(element);
        header = element[0];
        listofheaders.push(header); // for test
        contentAfterHeader=  element.splice(0,1);

        splicedJSON[header] = contentAfterHeader; // for json
        console.log(splicedJSON[header]);
        
        outlinecontent = '';
        for (i=0; i<element.length; i++){
            if (element[i] === ''){

            } else {
                element[i] = element[i] + '<br>';
                outlinecontent += element[i];
            };
        };
        content = outlinecontent;
        row = outlinetable.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerHTML = header;
        cell2.innerHTML = content;
    }); 

    // check
    console.log(testJSON);

};
