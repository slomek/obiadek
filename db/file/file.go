// Package file represents a structure and behaviour of JSON file-based recipe database.
package file

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"

	"github.com/slomek/obiadek/db"
)

var dbStr string

func init() {
	flag.StringVar(&dbStr, "file-db", "", "Path to database JSON file")
}

// Database represents a (JSON) file database.
type Database struct {
	recipes []db.Recipe
}

// NewDb creates a new (JSON) file database instance.
func NewDb() (Database, error) {
	noDb := Database{}

	if dbStr == "" {
		return noDb, fmt.Errorf("path to database JSON file has not been provided")
	}

	file, err := ioutil.ReadFile(dbStr)
	if err != nil {
		return noDb, fmt.Errorf("failed to read database file: %v", err)
	}

	var rs []db.Recipe
	if err = json.Unmarshal(file, &rs); err != nil {
		return noDb, fmt.Errorf("failed to read recipes from the database file: %v", err)
	}

	noDb.recipes = rs

	return noDb, nil
}

// GetAll returns all recipes from the database.
func (d Database) GetAll() ([]db.Recipe, error) {
	return d.recipes, nil
}
