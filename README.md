#UROP: DATA MINING

Description:
TBC
Getting Started:

Wikipedia API
Below are the parts of Wikipedia API involved. For a more extensive guide, please refer to Wikipedia's documentation here: https://www.mediawiki.org/wiki/API:Main_page

//

Used for normal searches in Wikipedia:" https://en.wikipedia.org/wiki/[insert_word_here]" . The url will lead you to thet page on wikipedia that shows the information of the search.

The Wikipedia API used for searching in English by adding more terms behind the url "https://en.wikipedia.org/w/api.php". The results obtained from the API are always in the form of JSON.

The word or phrase entered to search needs to be encoded in order for the API to work. Special characters needs to be shown in the ascii form (" " = %20 or just replace with '\_' ; "( , )" = "%28, %29"). This is done with the function: encodeURIComponent().

API that will give 10 suggestions on what you search may be refering to. It is similar to searching google and having 10 results given back: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTermtoSearch}&format=json"
Some of the basic details shown are the title, pageid and snippet

You can then choose the option you want by accessing data
You will first need to load the JSON file using the code:
loadJSON(urlforContent, gotContent, 'jsonp');
urlforContent is the url above
gotCotent is a function to be defined
'jsonp' is to indicate the type of file to read

You will need to then use:
data.query.search --> this will allow you to go into the arraw until the part where the options are listed (can use chart to show?)
key in the index and whatever you need. e.g. [index][title]

API to search for sources of images provided by Wikipedia: https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedOption}&origin=*
How to access it?
use JSON.stringify to convert data into text, make this into variable (aka variable = JSON.stringify(data))
use variable.search("https" or ".jpg") to find the start and end index, rmb to add characters for the end index
use variable.substring(startindex, endindex)
//

Wikipedia API

sentenceAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=${numofSentences}&exlimit=1&titles=${word}&explaintext=1&formatversion=2&format=json`;

Variable "word" is the keyword to be searched. Adjust the number of sentences using the variable "numofSentences".

urlSuggestions =`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`

Variable "encodedOption" is the option selected by the user, encoded in ascii format.

##**Code**

###main.js
The file contains the functions that search the user input in Wikipedia and return ten suggestions that matches closely with the user input. It then displays the options on the html page. The file also contains the function to clear search history.

functions:

    * setup(): start of code
        ** termTosearch: keyword/input by user, variable

    * loadJSON(x,y,z): required to read the JSON file from the Wikipedia API; x is the API used, y is the function used, and z is the format used(usually 'jsonp').

    * startSearch(termTosearch): search for the keyword/input using the Wikipedia API

    * gotContent(data): load the content from the JSON file received from the Wikipedia API.
        ** optionsAvailable.forEach(): loop action for each element in optionsAvailable

    * optionsmaybe(element,index): print element in optionsAvailable onto the html page.

    * clearHistory(): clear all histories of word searched and suggestions

###searchButton.js
This file contains the functions to perform search on Wikipedia based on the option that the user had chosen. The search will return the first few sentences of the content, an image(if any), hyperlink to the actual Wikipedia page embeded in the search history, and suggestions that the user may be interested in. The sentences and suggestions are adjustable according to preferences within the code, for this version it is set to the first two sentences and fifteen suggestions.

functions:

    * goldenButton(): search keyword chosen by the user.
        ** encodedURIComponent(): to encode keyword into ascii format so that the url can be readable

    * twoSentences(word): obtain the first two sentences of the search using the constant sentenceAPI.
        ** getTwoSentences(data): extract the two sentences from the json file and print the sentences on the html page.

    * gotImamge(data): extract the url of the image from the json file and print the image on the html page.

    * backupImage(encodedWordAgain): In the event that gotImage(data) was unable to obtain the image url, the function helps to search for the image again through another method using getimg(data)
        ** getimg(data): converts JSON file into a string and manually search for the image url, starting with "upload" and ending with either of the following: png|jpg|JPEG|svg.

    * getSuggestions(encodedOption): obtain possible suggestions using the constant urlSuggestions

    * findSuggestions(data): converts the JSON file into string, search for hyperlinked phrases/words ([[XXXX]]) and sort them based on how often it appears on the Wikipedia page using descendingUniqueSort().
    * createSuggestions(element, index): print element in slicedLinks onto the html page.

    * getJSONFile(): format the results of the search into JSON for storage purposes.

    * console_logJSON(): print the JSON file containing the results of the search in the console

    * resolveJSON(): set timer for JSON file containing the results of the search to be returned after 5 seconds.

    * getmultipleJSON(): print the JSON file containing all the results of the searches in the console.

    * displayHistory(OptionTitle, hyperlink): Display the history of all the keywords that were searched. the keywords displayed are hyperlinked with the url to the Wikipedia page.

    * createInfobox(OptionTitle): Search and display infobox present in the Wikipedia page. Refer to version2infobox.js.

    * possibleOutline(OptionTitle): Search for possible Outlines of the keyword. Refer to outline.js.

###version2infobox.js
This file contains the functions to look for possible infobox present in the Wikipedia page.

###tryelement.js
This file contains the functions to look for infobox present in the Wikipedia page for chemistry related keywords.

###outline.js
The file mainly contains the functions to display and store Wikipedia search, in the format of "Outline of:[title]", in JSON.

The format of Wikipedia search on Outlines are as such:
The headers for the different sections of the content are indicated with "==" in front and behind of the title. For example, "==Essence of Science=="
Following the headers, the contents can be classified into different categories:
"\s\w" or "\w"
"#"
"#_"
"#\*\*"
"_"

To represent the information

newindex.html
