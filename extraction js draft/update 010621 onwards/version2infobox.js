/** version 2 */
function createInfobox(inputphrase){
    wordInfobox = inputphrase
    //wordInfobox = document.getElementById('wordSearched')
    console.log(wordInfobox)
    encodedwordInfobox = encodeURIComponent(wordInfobox)
    urlGetPageid = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedwordInfobox}&format=json`
    console.log(urlGetPageid)
    loadJSON(urlGetPageid, infoboxPageid, 'jsonp')
}

function infoboxPageid(data) {
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
    myInfoboxstr = JSON.stringify(data)
    
    //cases
    if (myInfoboxstr.includes('{Automatic taxobox')||myInfoboxstr.includes('{Taxobox')){
        taxoboxStart = myInfoboxstr.indexOf('{Automatic taxobox')
        if (taxoboxStart==-1){
            taxoboxStart =myInfoboxstr.indexOf('{Taxobox')
        }
        taxoboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
        if (taxoboxEnd==-1){
            taxoboxEnd = myInfoboxstr.indexOf("\\n\\n'''")
        }
        buildInfobox(taxoboxStart, taxoboxEnd)
        console.log('taxobox')

    }else if (myInfoboxstr.includes('{Speciesbox')||myInfoboxstr.includes('{Subspeciesbox')){
        speciesboxStart = myInfoboxstr.indexOf('{Speciesbox')
        if (speciesboxStart==-1){
            speciesboxStart =myInfoboxstr.indexOf('{Subspeciesbox')
        }
        speciesboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
        buildInfobox(speciesboxStart, speciesboxEnd)
        console.log('Speciesbox')

    }else if (myInfoboxstr.includes('{Chembox')){
        chemboxStart = myInfoboxstr.indexOf('{Chembox')
        chemboxEnd = myInfoboxstr.indexOf('\\n}}\\n\\n')
        buildInfobox(chemboxStart, chemboxEnd)
        console.log('Chemobox')

    }else if (myInfoboxstr.includes('{Infobox')||myInfoboxstr.includes('{infobox book')){
        infoboxStart = myInfoboxstr.indexOf('{Infobox')
        if (infoboxStart == -1){
            infoboxStart = myInfoboxstr.indexOf('{infobox book')
        }
        infoboxEnd = myInfoboxstr.search(/\\n\}\}(\s+|\\n)(\W+''|\W\w+''|\W\w\W+''|<|\\n\w|\{\{Infobox)|\\n(\w+\s'''|''')|\\n\{\{Collapsed\sinfobox/g) 
        /**VERY IMPORTANT REGEX HERE! */
        buildInfobox(infoboxStart, infoboxEnd)
        console.log('infobox')

    } else{
        infoboxStart = -1
        infoboxEnd = -1
        buildInfobox(infoboxStart, infoboxEnd)
    }

    /**if present, change to true, else print no infobox available */
    /**SEARCH THIS LAST!!! need to search using Template:__ */
    elementboxStart = myInfoboxstr.indexOf('{Infobox element')
    elementboxEnd = myInfoboxstr.indexOf('<!--')
    /**LEFT WITH INFOBOX ELEMENT */
}


function buildInfobox(infoboxStart, infoboxEnd) {

    console.log(infoboxStart, infoboxEnd)
    myInfobox = myInfoboxstr.substring(infoboxStart, infoboxEnd+3)
    console.log(myInfobox)

    /**HERE ONNWARDS IS CREATION OF INFOTABLE */
    if (infoboxStart === -1| infoboxEnd === -1){
            thegoldenTable = document.getElementById('infoTable')
            thegoldenTable.innerHTML=''
            nothingRow = thegoldenTable.insertRow(0)
            nothingRow.innerHTML ="No infobox available"
            console.log("If you expected sth, go check the api") // for checking
        
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

        /** Maybe make the below a global function, with global variable of myInfobox */
        /**SECTION: STANDARD WAY TO FIND TITLES AND VALUES FOR THE INFOBOX */
        startingPoint = myInfobox.indexOf("\\n|")
        myInfobox = myInfobox.substring(startingPoint+4,myInfobox.length)
        
        listofCategories = []

        /**Step below: loop to find "\n|" one by one until there's none left */
        while (myInfobox.search(/\\n\|/g) != -1){
            endCat = myInfobox.indexOf("\\n|")
            one_cat = myInfobox.substring(0,endCat+3)
            listofCategories.push(one_cat)
            myInfobox = myInfobox.replace(one_cat,"")
        }

        if (myInfobox.length != 0){
            listofCategories.push(myInfobox)
        }
        console.log('Categories: ', listofCategories)
        /** EMERGENCY CHECK: UP TILL HERE IT IS STILL CORRECT */

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
            /**cleaning title */
            if (listTitles[i].includes('_') == true) {
                listTitles[i] = listTitles[i].replace('_', ' ')
            }
            
            /**cleanning values */
            listValues[i] = listValues[i].replace(/(\{\{\w+\|)/g, '')
            listValues[i] = listValues[i].replace(/([\\\[\]\{\}])/g, '')
            listValues[i] = listValues[i].replace(/<(!|ref).+>/g,'')
            listValues[i] = listValues[i].replace(/'''/g, '')
            listValues[i] = listValues[i].replace(/\*/g, ';')
            
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
                cell2.innerHTML = listValues[i]
            }
        }
        
        if (thegoldenTable.rows[0].cells[0].innerHTML === 'Categories'){
            //pass
        }else {
            row = thegoldenTable.insertRow(0)
            header1 = row.insertCell(0)
            header2 = row.insertCell(1)
            header1.innerHTML = "Categories"
            header2.innerHTML = "Details"
        }

    }
}

// todo: taxobox
// fucntion to choose between Template, infobox, chembox, taxobox
