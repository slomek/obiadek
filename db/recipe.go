package db

// Recipe is a representation of a single recipe item.
type Recipe struct {
	Name  string
	Tags  []string
	Other []string
}
