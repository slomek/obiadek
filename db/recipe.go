// Package db represents the definitions of items stored in the database.
package db

// Recipe is a representation of a single recipe item.
type Recipe struct {
	Name  string
	Tags  []string
	Other []string
}
