package db

// Db defines a behaviour expected from a database.
type Db interface {
	GetAll() ([]Recipe, error)
}

// Database represents a database instance.
type Database struct{}

//NewDatabase creates a new database instance.
func NewDatabase() Database {
	return Database{}
}

// GetAll returns all recipes from the database.
func (d Database) GetAll() ([]Recipe, error) {
	return []Recipe{
		Recipe{Name: "Recipe #1", Key: []string{"Key #1"}},
		Recipe{Name: "Recipe #2", Key: []string{"Key #2"}},
		Recipe{Name: "Recipe #3", Key: []string{"Key #3"}},
	}, nil
}
