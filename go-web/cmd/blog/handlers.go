package main

import (
	"html/template"
	"log"
	"net/http"
)

type indexPageData struct {
	Title    string
	Subtitle string
}

func index(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/index.html")

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return
	}

	data := indexPageData{
		Title:    "Blog for traveling",
		Subtitle: "Subtitle for my page",
	}

	err = ts.Execute(w, data)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return
	}

	log.Println("Request complited successfully")
}
