package main

import (
	"html/template"
	"net/http"
)

type linkData struct {
	Title string
}

type linksData struct {
	Links []linkData
}

func links() []linkData {
	return []linkData{
		{
			Title: "Home",
		},
		{
			Title: "Categories",
		},
		{
			Title: "About",
		},
		{
			Title: "Contact",
		},
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("pages/index.html")

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}

	links := linksData{
		Links: links(),
	}

	err = tmpl.Execute(w, links)

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
}
