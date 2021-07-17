function outlineonly() {

    keyword = 'biology'
    apirequired =`https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=Outline_of_${keyword}&format=json`
    console.log(apirequired)
    loadJSON(apirequired,showoutine,'jsonp')

}


function showoutine(data) {
    showdata = JSON.stringify(data)
    newdata = showdata.substring(showdata.indexOf('=='), showdata.length)
    console.log(newdata)


    headers_index = []
    temp_contentunderheader = []
    contentunderheader = []
    list_of_headers = newdata.match(/(==)+[=\w\s]+==/g)
    list_of_headers.forEach(element => {
        singleindex = newdata.indexOf(element)
        headers_index.push(singleindex)
    })
    console.log(list_of_headers)
    console.log(headers_index)

    for (i=0; i< headers_index.length; i++) {
        partialsection = newdata.substring(headers_index[i],headers_index[i+1])
        temp_contentunderheader.push(partialsection)
    }
    console.log(temp_contentunderheader)

    temp_contentunderheader.forEach(element => {
        splittedcontent = element.split(/\\n\*|\\n/g)
        splittedcontent[0] = splittedcontent[0].replace(/=/g, "")
        for (j=0; j<splittedcontent.length; j++) {
            splittedcontent[j] = splittedcontent[j].replace(/[\[\]]/g, "")
        }
        contentunderheader.push(splittedcontent)    
    })

    console.log('spliced: ', contentunderheader)

    outlinetable = document.getElementById('outline');
    outlinetable.innerHTML =''
    
    contentunderheader.forEach(element => {
        header = element.splice(0,1)
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
    })
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

