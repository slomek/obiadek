// Package drawer package is responsible for generating a list of uniquely-tagged dinner suggestions that are fetched from the database.
package drawer

import (
	"flag"
	"fmt"
	"math/rand"
	"time"

	"github.com/slomek/obiadek/db"
)

var numOfResults int

func init() {
	flag.IntVar(&numOfResults, "n", 5, "number of expected results")
}

// Draw returns a list of suggested recipies for upcoming week.
func Draw(d db.Db) ([]db.Recipe, error) {
	res := []db.Recipe{}

	rs, err := d.GetAll()

	if err != nil {
		return res, fmt.Errorf("failed to load recipes from db: %v", err)
	}

	if numOfResults < 1 {
		return res, fmt.Errorf("cannot draw non-positive number of recipes")
	}

	rsCount := len(rs)
	if rsCount < numOfResults {
		return res, fmt.Errorf("failed to find enough recipes in the database (expected: %d, found: %d)", numOfResults, rsCount)
	}

	tagsUsed := make(map[string]bool)

	rand.Seed(time.Now().UnixNano())
	p := rand.Perm(rsCount)
	for i := 0; len(res) < numOfResults && i < rsCount; i++ {
		index := p[i]
		recipe := rs[index]

		if hasUsedTags(tagsUsed, recipe) {
			continue
		}
		res = append(res, recipe)
		saveTags(tagsUsed, recipe)
	}

	return res, nil
}

func hasUsedTags(tagsUsed map[string]bool, r db.Recipe) bool {
	for _, t := range r.Tags {
		_, alreadyIn := tagsUsed[t]
		if alreadyIn {
			return true
		}
	}
	return false
}

func saveTags(tagsUsed map[string]bool, r db.Recipe) {
	for _, t := range r.Tags {
		tagsUsed[t] = true
	}
}
