package main

import (
	"flag"
	"log"

	"github.com/slomek/obiadek/db"
	"github.com/slomek/obiadek/drawer"
)

var numOfResults int

func init() {
	flag.IntVar(&numOfResults, "n", 5, "number of expected results")
}

func main() {
	flag.Parse()

	d, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	rs, err := drawer.Draw(d, numOfResults)
	if err != nil {
		log.Fatalf("Failed to draw recipes: %v", err)
	}

	for i, r := range rs {
		log.Printf("%d: %s (%v)", (i + 1), r.Name, r.Tags)
	}
}
