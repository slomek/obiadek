package db

// Db defines a behaviour expected from a database.
type Db interface {
	GetAll() ([]Recipe, error)
}
