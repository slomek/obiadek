// Package dbfactory provides an utility function to create a database intance of type provided with runtime parameters (flags).
package dbfactory

import (
	"flag"
	"fmt"

	"github.com/slomek/obiadek/db"
	"github.com/slomek/obiadek/db/file"
	"github.com/slomek/obiadek/db/mongo"
)

var dbType string

func init() {
	flag.StringVar(&dbType, "db", "mongo", "Type of database used")
}

// NewDatabase creates a new DB instance basing on "db" flag.
func NewDatabase() (db.Db, error) {
	switch dbType {
	case "file":
		return file.NewDb()
	case "mongo":
		return mongo.NewDb()
	default:
		return nil, fmt.Errorf("failed to create database for type: %s", dbType)
	}
}
