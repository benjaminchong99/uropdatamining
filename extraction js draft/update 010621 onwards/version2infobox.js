/** version 2 */
function createInfobox(inputphrase){
    // start by finding the page id
    wordInfobox = inputphrase
    //wordInfobox = document.getElementById('wordSearched')
    console.log(wordInfobox)
    encodedwordInfobox = encodeURIComponent(wordInfobox)
    urlGetPageid = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedwordInfobox}&format=json`
    console.log(urlGetPageid)
    loadJSON(urlGetPageid, infoboxPageid, 'jsonp')
}


function infoboxPageid(data) {
    // found pageid, then start to find if there is infotable
    findingPageid = JSON.stringify(data)
    console.log(findingPageid)
    pageidStart = findingPageid.indexOf('"pageid":')
    pageidEnd = findingPageid.indexOf('"ns":')
    console.log(pageidStart, pageidEnd)
    finallyPageid = findingPageid.substring(pageidStart+9, pageidEnd-1)
    console.log('in function: ',finallyPageid)
    runTable(finallyPageid)
}


function runTable(finallyPageid){
    urlFindTable = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${finallyPageid}&section=0&prop=wikitext&format=json`
    console.log('running test', urlFindTable)
    loadJSON(urlFindTable, infoboxContent, 'jsonp')
}


function infoboxContent(data){
    // checking of cases first
    myInfoboxstr = JSON.stringify(data)
    wordtest = wordInfobox.toLowerCase()
    

    /** start checking which tyoe of infobox is present */
    if (myInfoboxstr.indexOf(`Infobox ${wordtest}`) != -1){
        /** chemical element */
        infoboxElement()  

        /** chemical element */
    }else {
        //cases; might want to consider using switch once the basic framework has been done
        if (myInfoboxstr.includes('{Automatic taxobox')||myInfoboxstr.includes('{Taxobox')||myInfoboxstr.includes('{Automatic Taxobox')){
            /** animal taxonomy -> genus */
            taxoboxStart = myInfoboxstr.indexOf('{Automatic taxobox')
            if (taxoboxStart==-1){
                taxoboxStart =myInfoboxstr.indexOf('{Taxobox')
                if (taxoboxStart==-1){
                    taxoboxStart =myInfoboxstr.indexOf('{Automatic Taxobox')
                }
            }
            taxoboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
            if (taxoboxEnd==-1){
                taxoboxEnd = myInfoboxstr.indexOf("\\n\\n'''")
            }
            buildInfobox(taxoboxStart, taxoboxEnd)
            console.log('taxobox')
    
            /** animal taxonomy -> genus */
        }else if (myInfoboxstr.includes('{Speciesbox')||myInfoboxstr.includes('{Subspeciesbox')||myInfoboxstr.includes('{speciesbox')||myInfoboxstr.includes('{subspeciesbox')){
            /** animal taxonomy -> species */
            speciesboxStart = myInfoboxstr.indexOf('{Speciesbox')
            if (speciesboxStart==-1){
                speciesboxStart = myInfoboxstr.indexOf('{Subspeciesbox')
                if (speciesboxStart==-1){
                    speciesboxStart = myInfoboxstr.indexOf('{speciesbox')
                    if (speciesboxStart ==-1){
                        speciesboxStart = myInfoboxstr.indexOf('{subspeciesbox')
                    }
                }
            }
            speciesboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
            if (speciesboxEnd == -1){
                speciesboxEnd = myInfoboxstr.indexOf('\\n}}\\n')
            }
            buildInfobox(speciesboxStart, speciesboxEnd)
            console.log('Speciesbox')

            /** animal taxonomy -> species */
        }else if (myInfoboxstr.includes('{Chembox')){
            /** chemistry compounds */
            chemboxStart = myInfoboxstr.indexOf('{Chembox')
            chemboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
            if (chemboxEnd == -1){
                chemboxEnd = myInfoboxstr.indexOf("\\n'''")
            }
            buildInfobox(chemboxStart, chemboxEnd)
            console.log('Chemobox')

            /** chemistry compounds */
        }else if (myInfoboxstr.includes('{Infobox')||myInfoboxstr.includes('{infobox book')){
            /** infobox -> human related */
            infoboxStart = myInfoboxstr.indexOf('{Infobox')
            if (infoboxStart == -1){
                infoboxStart = myInfoboxstr.indexOf('{infobox book')
            }
            infoboxEnd = myInfoboxstr.search(/\\n\}\}(\s+|\\n)(\W+''|\W\w+''|\W\w\W+''|<|\\n\w|\{\{Infobox)|\\n(\w+\s'''|''')|\\n\{\{Collapsed\sinfobox/g) 
            /**VERY IMPORTANT REGEX HERE! */
            buildInfobox(infoboxStart, infoboxEnd)
            console.log('infobox')

            /** infobox -> human related */
        } else{
            /** no infobox present */
            infoboxStart = -1
            infoboxEnd = -1
            buildInfobox(infoboxStart, infoboxEnd)

            /** no infobox present */
        }
    }
}


/**Start of constructing Infobox */
function buildInfobox(infoboxStart, infoboxEnd) {

    console.log(infoboxStart, infoboxEnd)
    myInfobox = myInfoboxstr.substring(infoboxStart, infoboxEnd+3)
    console.log(myInfobox)

    /**CREATION OF INFOTABLE */
    if (infoboxStart === -1| infoboxEnd === -1){
            thegoldenTable = document.getElementById('infoTable')
            thegoldenTable.innerHTML=''
            nothingRow = thegoldenTable.insertRow(0)
            nothingRow.innerHTML ="No infobox available"
            console.log("If you expected sth, go check the api") // for checking

            // for json 
            infobox_json = ['no infobox available']
        
    } else{
        /**Double check no more infobox exist */
        doublecheckinginfobox = myInfoboxstr.replace(myInfobox, '')
        if (doublecheckinginfobox.indexOf('Collapsed infobox')!=-1){
            special_start = myInfobox.substring(0, myInfobox.length-2)
            collapsedInfoboxStart = doublecheckinginfobox.indexOf("\\n{{Infobox")
            collapsedInfoboxNew = doublecheckinginfobox.substring(collapsedInfoboxStart+3,doublecheckinginfobox.length)
            collapsedInfoboxNew_Start = collapsedInfoboxNew.indexOf("\\n|")
            collapsedInfoboxNew_End = collapsedInfoboxNew.indexOf("}}\\n  {{Collapsed")
            collapsedInfoboxNew_continued = collapsedInfoboxNew.substring(collapsedInfoboxNew_Start+3, collapsedInfoboxNew_End-3)

            remainingStart = doublecheckinginfobox.indexOf("section end}}")
            remainingEnd = doublecheckinginfobox.indexOf("\\n}}\\n") 
            remainingInfobox = doublecheckinginfobox.substring(remainingStart+16, remainingEnd)

            myInfobox = special_start +"\\n|" + collapsedInfoboxNew_continued + "\\n|" + remainingInfobox
        }

        /**SECTION: STANDARD WAY TO FIND TITLES AND VALUES FOR THE INFOBOX */
        startingPoint = myInfobox.indexOf("\\n|")
        startingPoint = startingPoint + 3
        if (startingPoint > 103){
            startingPoint =myInfobox.indexOf("\\n |")
            startingPoint = startingPoint +4
        }
        myInfobox = myInfobox.substring(startingPoint,myInfobox.length)
        
        listofCategories = []

        /**Step below: loop to find "\n|" one by one until there's none left */
        /** TAKE NOTE: SOME CASES IS \n |, WHICH ARE NOT YET ACCOUNTED FOR; if infobox titles < 10 */
        while (myInfobox.search(/\\n\|/g) != -1) {
            endCat = myInfobox.indexOf("\\n|")
            one_cat = myInfobox.substring(0,endCat+3)
            listofCategories.push(one_cat)
            myInfobox = myInfobox.replace(one_cat,"")
        }

        if (myInfobox.length != 0){
            listofCategories.push(myInfobox)
        }
        console.log('Categories: ', listofCategories)

        listTitles = []
        listValues = []
        for (i=0; i<listofCategories.length; i++) {
            findTitles = listofCategories[i].substring(0, listofCategories[i].indexOf("=")+1)
            findValues = listofCategories[i].replace(findTitles,'')
            a_Value = findValues.substring(0,findValues.length-2)
            a_Value = a_Value.replace('n*', '')
            a_Value = a_Value.replace(/\\n/g, '')

            listTitles.push(findTitles.replace(/\s+=/g, ''))
            listValues.push(a_Value)
        }
        console.log('Titles: ', listTitles)
        console.log('Values: ', listValues)

        /**CLEANING BELOW */
        for (i = 0; i < listTitles.length; i++) {
            /** create sth to loop until it finds a reasonable title */

            /**cleaning title */
            if (listTitles[i].includes('_') == true) {
                listTitles[i] = listTitles[i].replace('_', ' ')
            }
            listTitles[i] = listTitles[i].replace('=', '')
            
            /**cleanning values */            
            listValues[i] = listValues[i].replace(/\{\{dagger\}\}/g,'')
            listValues[i] = listValues[i].replace(/(\{\{\w+\|)/g, '')
            listValues[i] = listValues[i].replace(/\]\]/g,';')
            listValues[i] = listValues[i].replace(/([\\\[\]\{\}])/g, '')
            listValues[i] = listValues[i].replace(/<(!|ref).+>/g,'')
            listValues[i] = listValues[i].replace(/'''/g, '')
            listValues[i] = listValues[i].replace(/\*/g, ';')
            listValues[i] = listValues[i].replace(/italics[\w\S]+\|/g, '')
            listValues[i] = listValues[i].replace(/<br>/g, '')

            //make list of information into array
            if (listValues[i].includes('bulleted list')) { //case 1: list is obvious
                array = [];
                val = listValues[i].match(/\|(\d+(\D\d|)\D)+[\s\w()]+/g)
                if (val == null) {
                    //pass for now
                } else {
                    val.forEach(element => {
                        element = element.replace('|','')
                        array.push(element)
                    })
                }
                listValues[i] = array
            } else if (listValues[i].includes(';')) { //case 2: ';' as seperation
                array = listValues[i].split(';')
                for (j=0; j< array.length; j++)
                    if (array[j].includes("|")) {
                        counter = (array[j].match(/\|/g) || []).length
                        if (counter == 1){
                            array[j] = array[j].replace(/\|[\w\s.()-]*/g, '')
                    }
                }
                listValues[i] = array
            } 

            //to only display the more defining information
            if (listValues[i].includes("|")) {
                counter = (listValues[i].match(/\|/g) || []).length
                if (counter == 1){
                    listValues[i] = listValues[i].replace(/\|[\w\s]*/g, '')
                } else {
                    if (listTitles[i].includes('coordinates')){
                        //pass
                    }else {
                        array = listValues[i].split('|')
                        listValues[i] =array
                    }
                }
            }
            //remove unnecessary '' in the array
            if (typeof listValues[i] == 'object'){
                for (j = 0; j < listValues[i].length; j++){
                    if (listValues[i][j] === ''){
                        listValues[i].splice(j, 1)
                    }
                }
            }

        }
        
        console.log(listTitles)
        console.log(listValues)
        thegoldenTable = document.getElementById('infoTable')
        thegoldenTable.innerHTML=''
        
        for (i=0; i<listTitles.length; i++){ 
            if (listValues[i]===''|| listValues[i]===' '){
                //pass
            } else if (listValues[i].includes('<!')===true){
                //pass
            }else{
                rowName = `row${i}`
                row = thegoldenTable.insertRow(-1)
                cell1 = row.insertCell(0)
                cell1.setAttribute('id', 'Title')
                cell2 = row.insertCell(1)
                cell1.innerHTML = listTitles[i]
                
                if (typeof listValues[i] === 'object'){ // for displaying the infotable on the website
                    console.log('running array')
                    for (j=0; j< listValues[i].length; j++){
                        cell2.innerHTML += '<br>' + listValues[i][j]
                    }
                }else {
                    cell2.innerHTML = listValues[i]
                }
            }
        }
        row = thegoldenTable.insertRow(0)
        header1 = row.insertCell(0)
        header2 = row.insertCell(1)
        header1.innerHTML = "Categories"
        header2.innerHTML = "Details"

        //store as json
        infobox_json = []
        for (i=0; i< listTitles.length; i++) {
            perCat = `${listTitles[i]} : ${listValues[i]}`
            infobox_json.push(perCat)
        }
    }
}

// todo: taxobox
// fucntion to choose between Template, infobox, chembox, taxobox
