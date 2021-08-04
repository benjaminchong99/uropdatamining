# UROP: DATA MINING

## Description:

This project aims to develop an efficient algorithm to extract open access information from Wikipedia present the information in a concise manner.

## Getting Started:

### Wikipedia API

Below are the parts of Wikipedia API involved. For a more extensive guide, please refer to Wikipedia's documentation here: https://www.mediawiki.org/wiki/API:Main_page

- sentenceAPI:

`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=${numofSentences}&exlimit=1&titles=${word}&explaintext=1&formatversion=2&format=json`

API to find the first few sentences of the keyword searched

- urlSuggestions:

`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=${encodedOption}&rvslots=*&rvprop=content&format=json`

API to find content of the keyword searched.

- urlGetPageid:

`https://en.wikipedia.org/w/api.php?action=query&titles=${encodedwordInfobox}&format=json`

API to find the page ID of the Wikipedia page of the keyword searched.

- urlFindTable:

`https://en.wikipedia.org/w/api.php?action=parse&pageid=${finallyPageid}&section=0&prop=wikitext&format=json`

API to find content of the keyword searched.

- urlGetPageidElement:

`https://en.wikipedia.org/w/api.php?action=query&titles=Template:Infobox_${encodedwordInfobox}&format=json`

API to find content of the keyword that is related to chemical element.

- outlinepossibilities:

`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Outline_of_${keyword}&format=json`

API to find suggested searches of the "Outline of [keyword]"

- outlineapirequired:

`https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${selectedOutline}&format=json`

API to find content of the Outline of keyword.

### p5.js

This file is required to provide a means to read the JSON file obtained from the Wikipedia API. It includes functions such as setup() and loadJSON().

## Code

### main.js

The file contains the functions that search the user input in Wikipedia and return ten suggestions that matches closely with the user input. It then displays the options on the html page. The file also contains the function to clear search history.

functions:

- setup():
  start of code

- termTosearch:
  keyword/input by user, variable

- loadJSON(x,y,z):
  required to read the JSON file from the Wikipedia API.

- startSearch(termTosearch):
  search for the keyword/input using the Wikipedia API

- gotContent(data):
  load the content from the JSON file received from the Wikipedia API.

- optionsAvailable.forEach():
  loop action for each element

- optionsmaybe(element,index):
  print element in optionsAvailable onto the html page.

- clearHistory():
  clear all histories of word searched and suggestions

### searchButton.js

This file contains the functions to perform search on Wikipedia based on the option that the user had chosen.

functions:

- searchButton():
  search keyword

- encodedURIComponent():
  encode keyword into ascii format

- twoSentences(word):
  obtain the first two sentences of content using sentenceAPI.

- getTwoSentences(data):
  extract the two sentences from the json file.

- gotImamge(data):
  extract the url of the image from the json file.

- backupImage(encodedWordAgain):
  In the event that gotImage(data) was unable to obtain the image url, search for the image again using getimg(data)

- getimg(data):
  converts JSON file into a string and search for the image url

- getSuggestions(encodedOption):
  obtain possible suggestions using urlSuggestions

- findSuggestions(data):
  converts the JSON file into string, search hyperlinked phrases/words

- descendingUniqueSort():
  sort hyperlinked phrases/words

- createSuggestions(element, index):
  print element in slicedLinks onto html page.

- getJSONFile():
  format results of the search into JSON for storage purposes.

- console_logJSON():
  print JSON file containing results of the search in the console

- resolveJSON():
  set timer for JSON file of results of the search to be returned after 5 seconds.

- getmultipleJSON():
  print JSON file containing all results of the searches in the console.

- displayHistory(OptionTitle, hyperlink):
  Display history of all keywords that were searched with hyperlink.

- createInfobox(OptionTitle):
  Search and display infobox. Refer to version2infobox.js.

- possibleOutline(OptionTitle):
  Search for possible Outlines of the keyword. Refer to outline.js.

### version2infobox.js

This file contains the functions to look for possible infobox present in the Wikipedia page. Infoboxes are short concised information stored in the form of a table and usually displayed on the right column on the Wikipedia page.

functions:

- createInfobox(inputphrase):
  start of finding infobox by first finding the pageid of the Wikipedia page using urlGetPageid.

- infoboxPageid(data):
  obtain pageid of the Wikipedia page and run the search for the infobox.

- runTable(finallyPageid):
  obtain JSON file and search for the presennce of infobox using the variable urlFindTable.

- infoboxContent(data):
  find the category of infobox:

  - infobox: (general) Usually more human related keywords(Famous person, Albums, Country, etc.)

  - chembox: Chemistry related keywords (more of mixtures, compounds)

  - element: Chemical elements

  - taxobox/ Automatic taxobox: Animals

  - speciesbox: Classification of animals

- buildInfobox(infoboxStart, infoboxEnd):
  construct the infobox on the html page.

### elementbox.js

This file contains the functions to look for infobox present in the Wikipedia page for keywords that are related to chemical element.

functions:

- infoboxElement():
  start of finding infobox.

- infoboxElementPageid(data):
  obtain pageid of the Wikipedia page and run the search for the infobox.

- runElementTable(finallyPageid):
  obtain JSON file and search for the presennce of infobox using the variable urlFindTable.

- checkElementExistence(data):
  confirms the existence of the infobox of the keyword searched.

### outline.js

The file mainly contains the functions to display and store Wikipedia search, in the format of "Outline of [title]", in JSON.

functions:

- possibleOutline(OptionTitle):
  search "Outline of [keyword]" in Wikipedia.

- showOutlineOptions(data):
  print out the results of the possible searches of "Outline of keyword" on the html page.

- outlineonly():
  start search for outline that the user chose.

- showoutine(data):
  take the JSON file, read and repackage the information into a simpler JSON file.
