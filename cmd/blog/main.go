package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func main() {
	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}

	dbx := sqlx.NewDb(db, dbDriverName)

	mux := http.NewServeMux()
	mux.HandleFunc("/home", index(dbx))
	mux.HandleFunc("/post", post(dbx))

	FileServer := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static/", FileServer))

	fmt.Println("start server " + port)

	err = http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatal(err)
	}
}

func openDB() (*sql.DB, error) {
	return sql.Open(dbDriverName, "root:1234@tcp(localhost:3306)/blog?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}
