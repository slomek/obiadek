package drawer

import (
	"github.com/slomek/obiadek/db"
	"testing"
)

type tDb struct {
	recipes []db.Recipe
}

func (d tDb) GetAll() ([]db.Recipe, error) {
	return d.recipes, nil
}

func TestShouldRaiseErrorIfNoRecipesInDb(t *testing.T) {
	_, err := Draw(tDb{}, 1)
	if err == nil {
		t.Error("Expected an exception, but none was thrown")
	}
}

func TestShouldRaiseErrorIfUserExpectsNonPositiveResultsCount(t *testing.T) {
	_, err := Draw(tDb{}, 0)
	if err == nil {
		t.Error("Expected an exception, but none was thrown")
	}

	_, err = Draw(tDb{}, -1)
	if err == nil {
		t.Error("Expected an exception, but none was thrown")
	}
}

func TestShouldRaiseErrorIfNotEnoughRecipes(t *testing.T) {
	dbRs := []db.Recipe{
		db.Recipe{},
		db.Recipe{},
		db.Recipe{},
	}
	_, err := Draw(tDb{recipes: dbRs}, 4)
	if err == nil {
		t.Error("Expected an exception, but none was thrown")
	}
}

func TestShouldReturnGivenNumberOfRecipes(t *testing.T) {
	dbRs := []db.Recipe{
		db.Recipe{Name: "Recipe #1", Tags: []string{"Key #1"}},
		db.Recipe{Name: "Recipe #2", Tags: []string{"Key #2"}},
		db.Recipe{Name: "Recipe #3", Tags: []string{"Key #3"}},
	}
	rs, err := Draw(tDb{recipes: dbRs}, 2)
	if err != nil {
		t.Errorf("Not expecting an exception, but it was thrown: %v", err)
	}
	if len(rs) != 2 {
		t.Errorf("Expected to find 2 result recipies, but found %d", len(rs))
	}
}
