package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
)

type featuredPostData struct {
	Title       string  `db:"title"`
	Subtitle    string  `db:"subtitle"`
	Img         string  `db:"img"`
	Category    *string `db:"category"`
	Author      string  `db:"author"`
	AuthorImg   string  `db:"author_img"`
	PublishDate string  `db:"publish_date"`
}

type mostRecentPostData struct {
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Img         string `db:"img"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_img"`
	PublishDate string `db:"publish_date"`
}

type postPageData struct {
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	Img      string `db:"img"`
	Text     string `db:"text"`
}

type indexPageData struct {
	FeaturedPosts   []featuredPostData
	MostRecentPosts []mostRecentPostData
}

const postIndex = 6

func getPostData(db *sqlx.DB, id int) (postPageData, error) {
	query := fmt.Sprintf(`
		SELECT
			title,
			subtitle,
			img,
			text
		FROM
			post
		WHERE post_id = %d
	`, id)

	var post postPageData

	err := db.Get(&post, query)
	if err != nil {
		return postPageData{}, err
	}

	return post, nil
}

func getFeaturedPosts(db *sqlx.DB) ([]featuredPostData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			img,
			(SELECT name FROM categories WHERE id = post.category_id) AS category,
			publish_date,
			(SELECT name FROM users WHERE id = post.user_id) AS author,
			(SELECT img FROM users WHERE id = post.user_id) AS author_img
		FROM
			post
		WHERE featured = 1
	`

	var posts []featuredPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func getMostRecentPosts(db *sqlx.DB) ([]mostRecentPostData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			img,
			publish_date,
			(SELECT name FROM users WHERE id = post.user_id) AS author,
			(SELECT img FROM users WHERE id = post.user_id) AS author_img
		FROM
			post
		WHERE featured IS NULL
	`

	var posts []mostRecentPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		featuredPosts, err := getFeaturedPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		mostRecentPosts, err := getMostRecentPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		tmpl, err := template.ParseFiles("pages/index.html")

		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := indexPageData{
			FeaturedPosts:   featuredPosts,
			MostRecentPosts: mostRecentPosts,
		}

		err = tmpl.Execute(w, data)

		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		post, err := getPostData(db, postIndex)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		funcMap := template.FuncMap{
			"split": strings.Split,
		}

		tmpl, err := template.New("post.html").Funcs(funcMap).ParseFiles("pages/post.html")

		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = tmpl.Execute(w, post)

		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}
