import wikipedia
import wikipediaapi

enterKeyword = input("Enter keyword to search")
wikipedia.search(enterKeyword)

summarypg = wikipedia.page(enterKeyword).summary

print(summarypg)
