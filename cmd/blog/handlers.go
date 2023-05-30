package main

import (
	"encoding/base64"
	"encoding/json"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type createPostRequest struct {
	Title         string `json:"title"`
	Subtitle      string `json:"description"`
	Author        string `json:"authorName"`
	PublishDate   string `json:"publishDate"`
	Content       string `json:"content"`
	AuthorImg     string `json:"authorPhoto"`
	PostImg       string `json:"postImg"`
	AuthorImgName string `json:"authorPhotoName"`
	PostImgName   string `json:"postImgName"`
}

type featuredPostData struct {
	Id          string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Img         string `db:"img"`
	Category    string `db:"category"`
	Author      string `db:"author"`
	AuthorImg   string `db:"authorImg"`
	PublishDate string `db:"publish_date"`
}

type mostRecentPostData struct {
	Id          string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Img         string `db:"img"`
	Author      string `db:"author"`
	AuthorImg   string `db:"authorImg"`
	PublishDate string `db:"publish_date"`
}

type postPageData struct {
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	Img      string `db:"img"`
	Text     string `db:"text"`
}

type indexPageData struct {
	FeaturedPosts   []*featuredPostData
	MostRecentPosts []*mostRecentPostData
}

func createPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		var req createPostRequest

		err = json.Unmarshal(body, &req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		imgAuthor, err := base64.StdEncoding.DecodeString(strings.Split(req.AuthorImg, "base64,")[1])
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		fileAuthor, err := os.Create("static/img/" + req.AuthorImgName)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		_, err = fileAuthor.Write(imgAuthor)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		imgPost, err := base64.StdEncoding.DecodeString(strings.Split(req.PostImg, "base64,")[1])
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		filePost, err := os.Create("static/img/" + req.PostImgName)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		_, err = filePost.Write(imgPost)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		err = savePost(db, req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request successful")
	}
}

func savePost(db *sqlx.DB, req createPostRequest) error {
	const query = `
	INSERT INTO post (title, subtitle, img, text, category, publish_date, author, authorImg, featured)
	VALUES
	  (?, ?, ?, ?, ?, ?, ?, ?, 0)`
	_, err := db.Exec(query, req.Title, req.Subtitle, "/static/img/"+req.PostImgName, req.Content, "", req.PublishDate, req.Author, "/static/img/"+req.AuthorImgName)
	return err
}

func getPostData(db *sqlx.DB, id int) (postPageData, error) {
	query := `
		SELECT
			title,
			subtitle,
			img,
			text
		FROM
			post
		WHERE post_id = ?`

	var post postPageData

	err := db.Get(&post, query, id)
	if err != nil {
		return postPageData{}, err
	}

	return post, nil
}

func getFeaturedPosts(db *sqlx.DB) ([]*featuredPostData, error) {
	const query = `
		SELECT
			post_id,
			title,
			subtitle,
			img,
			category,
			publish_date,
			author,
			authorImg
		FROM
			post
		WHERE featured = 1
	`

	var posts []*featuredPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func login(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return
	}
	tmpl.Execute(w, nil)
}

func admin(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("pages/admin.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return
	}
	tmpl.Execute(w, nil)
}

func getMostRecentPosts(db *sqlx.DB) ([]*mostRecentPostData, error) {
	const query = `
		SELECT
			post_id,
			title,
			subtitle,
			img,
			publish_date,
			author,
			authorImg
		FROM
			post
		WHERE featured = 0
	`

	var posts []*mostRecentPostData

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
		postIDStr := mux.Vars(r)["postID"]

		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid order id", 403)
			log.Println(err)
			return
		}

		post, err := getPostData(db, postID)

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
