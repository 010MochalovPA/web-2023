package main

import (
	"html/template"
	"net/http"
)

type linkData struct {
	Title string
	Url   string
}

type featuredPostData struct {
	Title       string
	Subtitle    string
	ImgModifier string
	Label       string
	Author      string
	AuthorImg   string
	PublishDate string
}

type mostRecentData struct {
	Title       string
	Subtitle    string
	CardImg     string
	Author      string
	AuthorImg   string
	PublishDate string
}

type indexPageData struct {
	Title          string
	PrimaryLinks   []linkData
	SecondaryLinks []linkData
	FeaturedPosts  []featuredPostData
	MostRecent     []mostRecentData
}

type postPageData struct {
	Title        string
	Subtitle     string
	PrimaryLinks []linkData
}

func getPrimaryLinks() []linkData {
	return []linkData{
		{
			Title: "Home",
			Url:   "#",
		},
		{
			Title: "Categories",
			Url:   "#",
		},
		{
			Title: "About",
			Url:   "#",
		},
		{
			Title: "Contact",
			Url:   "#",
		},
	}
}

func getSecondaryLinks() []linkData {
	return []linkData{
		{
			Title: "Nature",
			Url:   "#",
		},
		{
			Title: "Photography",
			Url:   "#",
		},
		{
			Title: "Relaxation",
			Url:   "#",
		},
		{
			Title: "Vacation",
			Url:   "#",
		},
		{
			Title: "Travel",
			Url:   "#",
		},
		{
			Title: "Adventure",
			Url:   "#",
		},
	}
}

func getFeaturedPosts() []featuredPostData {
	return []featuredPostData{
		{
			Title:       "The Road Ahead",
			Subtitle:    "The road ahead might be paved - it might not be.",
			ImgModifier: "featured-posts_light-image",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 25, 2015",
		},
		{
			Title:       "From Top Down",
			Subtitle:    "Once a year, go someplace you’ve never been before.",
			ImgModifier: "featured-posts_balloon-image",
			Label:       "adventure",
			Author:      "William Wong",
			AuthorImg:   "/static/img/william.jpg",
			PublishDate: "September 31, 2015",
		},
		{
			Title:       "Launching Air Lanterns",
			Subtitle:    "Once a year, go someplace you’ve never been before.",
			ImgModifier: "featured-posts_balloon-image",
			Author:      "William Wong",
			AuthorImg:   "/static/img/william.jpg",
			PublishDate: "October 7, 2016",
		},
		{
			Title:       "Behind the Northern Lights",
			Subtitle:    "The road ahead might be paved - it might not be.",
			ImgModifier: "featured-posts_light-image",
			Label:       "Northern Lights",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 25, 2015",
		},
	}
}

func getMostRecent() []mostRecentData {
	return []mostRecentData{
		{
			Title:       "Still Standing Tall",
			Subtitle:    "Life begins at the end of your comfort zone.",
			CardImg:     "/static/img/balloons.jpg",
			Author:      "William Wong",
			AuthorImg:   "/static/img/william.jpg",
			PublishDate: "September 25, 2015",
		},
		{
			Title:       "Sunny Side Up",
			Subtitle:    "No place is ever as bad as they tell you it’s going to be.",
			CardImg:     "/static/img/bridge.jpg",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 26, 2013",
		},
		{
			Title:       "Water Falls",
			Subtitle:    "We travel not to escape life, but for life not to escape us.",
			CardImg:     "/static/img/river.jpg",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 26, 2013",
		},
		{
			Title:       "Through the Mist",
			Subtitle:    "Travel makes you see what a tiny place you occupy in the world.",
			CardImg:     "/static/img/sea.jpg",
			Author:      "William Wong",
			AuthorImg:   "/static/img/william.jpg",
			PublishDate: "September 23, 2011",
		},
		{
			Title:       "Awaken Early",
			Subtitle:    "Not all those who wander are lost.",
			CardImg:     "/static/img/wires.jpg",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 26, 2013",
		},
		{
			Title:       "Try it Always",
			Subtitle:    "The world is a book, and those who do not travel read only one page.",
			CardImg:     "/static/img/waterfall.jpg",
			Author:      "Mat Vogels",
			AuthorImg:   "/static/img/mat.jpg",
			PublishDate: "September 26, 2013",
		},
	}
}

func index(w http.ResponseWriter, _ *http.Request) {
	tmpl, err := template.ParseFiles("pages/index.html")

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}

	data := indexPageData{
		Title:          "Escape.",
		PrimaryLinks:   getPrimaryLinks(),
		SecondaryLinks: getSecondaryLinks(),
		FeaturedPosts:  getFeaturedPosts(),
		MostRecent:     getMostRecent(),
	}

	err = tmpl.Execute(w, data)

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
}

func post(w http.ResponseWriter, _ *http.Request) {
	tmpl, err := template.ParseFiles("pages/post.html")

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}

	data := postPageData{
		Title:        "The Road Ahead",
		Subtitle:     "The road ahead might be paved - it might not be",
		PrimaryLinks: getPrimaryLinks(),
	}

	err = tmpl.Execute(w, data)

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		return
	}
}
