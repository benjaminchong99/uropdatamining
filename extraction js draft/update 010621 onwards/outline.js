function possibleOutline(OptionTitle) {
    keyword = OptionTitle
    keyword = keyword.toLowerCase()
    outlinepossibilities = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Outline_of_${keyword}&format=json`
    loadJSON(outlinepossibilities, showOutlineOptions, 'jsonp')
}

function showOutlineOptions(data){
    // push only options with outline
    search = data.query.search
    console.log(search)
    finaloutline = []
    search.forEach(element => {
        outlinetitle = element['title']
        if (outlinetitle.indexOf('Outline of') != -1){
            finaloutline.push(outlinetitle)
        }
    })
    console.log(finaloutline)

    for (k=0; k<10; k++) {
    documentid = `outline_${k}`
    document.getElementById(documentid).innerHTML = ''
    }
    
    for (i=0; i<finaloutline.length; i++) {
        documentid = `outline_${i}`
        document.getElementById(documentid).innerHTML = finaloutline[i]
    }

}

function outlineonly() {
// possible outline by searching outline of __ with normal search but show in another form table
    //keyword = OptionTitle    
    //indexkeyword = document.getElementById('selectOutline').options.selectedIndex
    selectedOutline = "Outline of science"
    //selectedOutline = finaloutline[indexkeyword]
    //console.log(selectedOutline)
    apirequired =`https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${selectedOutline}&format=json`
    console.log(apirequired)
    loadJSON(apirequired,showoutine,'jsonp')

}


function showoutine(data) {
    showdata = JSON.stringify(data)
    newdata = showdata.substring(showdata.indexOf('\\n=='), showdata.length)
    console.log(newdata)


    fortesting = [] // for test
    headers_index = []
    temp_contentunderheader = []
    contentunderheader = []
    list_of_headers = newdata.match(/(\\n==)+[\w\s]+==/g)
    list_of_headers.forEach(element => {
        singleindex = newdata.indexOf(element)
        headers_index.push(singleindex)
    })
    console.log(list_of_headers)
    console.log(headers_index)

    for (i=0; i< headers_index.length; i++) {
        partialsection = newdata.substring(headers_index[i],headers_index[i+1])
        temp_contentunderheader.push(partialsection) // split into the different contents
    }
    console.log(temp_contentunderheader)

    temp_contentunderheader.forEach(element => {
        splittedcontent = element.split(/\\n\*|\\n/g)
        console.log(splittedcontent)
        truesplittedcontent = []
        splittedcontent[1] = splittedcontent[1].replace(/=/g, "")
        for (j=0; j<splittedcontent.length; j++) {
            splittedcontent[j] = splittedcontent[j].replace(/[\[\]]/g, "")
            if (splittedcontent[j] == ''){

            } else {
                truesplittedcontent.push(splittedcontent[j])
            }
        }
        contentunderheader.push(truesplittedcontent)    
        fortesting.push(truesplittedcontent) //for test
    })

    console.log('spliced: ', contentunderheader) // first filter to make sure no empty list

    outlinetable = document.getElementById('outline');
    outlinetable.innerHTML =''
    
    splicedJSON = {}
    listofheaders = [] // for test
    contentunderheader.forEach(element => {
        console.log(element)
        header = element[0]
        listofheaders.push(header) // for test
        contentAfterHeader=  element.splice(0,1)

        splicedJSON[header] = contentAfterHeader // for json
        console.log(splicedJSON[header])
        
        outlinecontent = ''
        for (i=0; i<element.length; i++){
            if (element[i] === ''){

            } else {
                element[i] = element[i] + '<br>'
                outlinecontent += element[i]
            }
        }
        content = outlinecontent
        row = outlinetable.insertRow(-1)
        cell1 = row.insertCell(0)
        cell2 = row.insertCell(1)
        cell1.innerHTML = header
        cell2.innerHTML = content
    }) // bring this backward after finiishing 


    // testing starts here
    testJSON = {}
    console.log(fortesting)
    console.log(listofheaders)
    
    for (i=0; i<fortesting.length; i++) {
        element = fortesting[i] // up till here still looks correct
        
        content = {}
        subcontent = {}
        subsubcontent = {}
        subx3content = {}
        for (j=0; j<element.length; j++){
            console.log(element[j])
            checksubcontent1 = element[j].search(/#\s/g) //check for special characters
            checksubcontent2 = element[j].search(/\*\s/g) //check for special characters
            checksubsubcontent = element[j].search(/#\*\s/g) //check for special characters
            checksubx3content = element[j].search(/#\*\*\s/g) //check for special characters
            
            if (checksubcontent1 == -1 || checksubcontent2 == -1) {
                content[element[j]] = {}
                testJSON[listofheaders[i]] = content
                
            } else if (checksubcontent1 == 0 || checksubcontent2 == 0) {
                currentcontent = Object.keys(content)[Object.keys(content).length -1]
                subcontent[element[j]] = {}
                testJSON[listofheaders[i]][currentcontent] = subcontent
                
            } else if (checksubsubcontent == 0) { //check #* ,currently not working
                subsubcontent[element[j]] = {}
                currentsubcontent = Object.keys(subcontent)[Object.keys(subcontent).length -1]
                console.log(currentsubcontent)
                testJSON[listofheaders[i]][currentcontent][currentsubcontent] = subsubcontent

            } else if (checksubx3content == 0) {
                subx3content[element[j]] = {}
                currentsubsubcontent = Object.keys(subsubcontent)[Object.keys(subsubcontent).length -1]
                testJSON[listofheaders[i]][currentcontent][currentsubcontent][currentsubsubcontent] = subx3content
            }


//            testcontentAfterHeader = []
//            //console.log(element[j])
//            if (element[j].indexOf("#") != 0) {
//                testcontentAfterHeader.push(element[j])
//                //console.log(testcontentAfterHeader)
//                testJSON[listofheaders[i]] = testcontentAfterHeader
//            } else if (element[j].indexOf(/#\s/g) === 0) {
//                
//            }
        }
    }
    console.log(testJSON)

    //continue on with json here first, then bring it before printing later 
    // check the first few letters, then straightaway add into json

}

    

//function organizecontent(element) {
//    splittedcontent = element.split(/\\n\*|\\n/g)
//    splittedcontent[0] = splittedcontent[0].replace(/=/g, "")
//    for (j=0; j<splittedcontent.length; j++) {
//        splittedcontent[j] = splittedcontent[j].replace(/[\[\]]/g, "")
//    }
//    contentunderheader.push(splittedcontent)
//}
// check for \n== ==\n ; between \n* ; \n* to \n
// == header of content
// === sections within the content
// ==== further classification in topic
// ===== final classification
// [[]]\n* is the content to show

