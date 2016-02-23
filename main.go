// OBIADEK
// Autor: Paweł Słomka <pslomka@pslomka.com>
// Obiadek is a simple application that draws a given numer of recipes (dinner/lunch ideas), helping to keep your diet varied.
package main

import (
	"flag"
	"log"

	"github.com/slomek/obiadek/db/dbfactory"
	"github.com/slomek/obiadek/drawer"
)

func main() {
	flag.Parse()

	d, err := dbfactory.NewDatabase()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	rs, err := drawer.Draw(d)
	if err != nil {
		log.Fatalf("Failed to draw recipes: %v", err)
	}

	for i, r := range rs {
		log.Printf("%d: %s (%v)", (i + 1), r.Name, r.Tags)
	}
}
