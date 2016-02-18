package db

import "gopkg.in/mgo.v2"
import "fmt"
import "flag"
import "time"

var dbStr string
var dbTimeout time.Duration

func init() {
	flag.StringVar(&dbStr, "db", "localhost/obiadek", "MongoDB URL")
	flag.DurationVar(&dbTimeout, "db-timeout", time.Second*5, "Timeout for MongoDB connection")
}

// Db defines a behaviour expected from a database.
type Db interface {
	GetAll() ([]Recipe, error)
}

// MongoDatabase represents a MongoDB database instance.
type MongoDatabase struct {
	db *mgo.Database
}

//NewDatabase creates a new database instance.
func NewDatabase() (MongoDatabase, error) {
	noDb := MongoDatabase{}

	dInfo, err := mgo.ParseURL(dbStr)
	if err != nil {
		return noDb, fmt.Errorf("failed to parse database url: %v", err)
	}

	dInfo.Timeout = dbTimeout

	session, err := mgo.DialWithInfo(dInfo)
	if err != nil {
		return noDb, fmt.Errorf("failed to connect to database: %v", err)
	}
	return MongoDatabase{db: session.DB(dInfo.Database)}, nil
}

// GetAll returns all recipes from the database.
func (d MongoDatabase) GetAll() ([]Recipe, error) {
	var res []Recipe

	if err := d.db.C("przepisy").Find(nil).All(&res); err != nil {
		return nil, fmt.Errorf("failed to fetch recipes: %v", err)
	}

	return res, nil
}
