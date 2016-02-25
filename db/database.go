// Package db represents the definitions of items stored in the database along with the database interface.
package db

// Db defines a behaviour expected from a database.
type Db interface {
	GetAll() ([]Recipe, error)
}
