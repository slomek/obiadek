// Package mongo represents a structure and behaviour of MongoDB-based recipe database.
package mongo

import (
	"flag"
	"fmt"
	"time"

	"gopkg.in/mgo.v2"

	"github.com/slomek/obiadek/db"
)

var dbStr string
var dbTimeout time.Duration

func init() {
	flag.StringVar(&dbStr, "mongo-db", "localhost/obiadek", "MongoDB URL")
}

// Database represents a MongoDB database instance.
type Database struct {
	db *mgo.Database
}

//NewDb creates a new Mongo database instance.
func NewDb() (Database, error) {
	noDb := Database{}

	dInfo, err := mgo.ParseURL(dbStr)
	if err != nil {
		return noDb, fmt.Errorf("failed to parse database url: %v", err)
	}

	dInfo.Timeout = 10 * time.Second

	session, err := mgo.DialWithInfo(dInfo)
	if err != nil {
		return noDb, fmt.Errorf("failed to connect to database: %v", err)
	}
	return Database{db: session.DB(dInfo.Database)}, nil
}

// GetAll returns all recipes from the database.
func (d Database) GetAll() ([]db.Recipe, error) {
	var res []db.Recipe

	if err := d.db.C("przepisy").Find(nil).All(&res); err != nil {
		return nil, fmt.Errorf("failed to fetch recipes: %v", err)
	}

	return res, nil
}
