// Package drawer package is responsible for generating a list of uniquely-tagged dinner suggestions that are fetched from the database.
package drawer

import (
	"flag"
	"fmt"
	"math/rand"
	"time"

	"github.com/slomek/obiadek/db"
	"strings"
)

var numOfResults int
var toExclude string

func init() {
	flag.IntVar(&numOfResults, "n", 5, "number of expected results")
	flag.StringVar(&toExclude, "exclude", "", "tags that are excluded from the results")
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

	tags := Tags{}

	tagsToExclude := strings.Split(toExclude, ",")
	tags.add(tagsToExclude)

	rand.Seed(time.Now().UnixNano())
	p := rand.Perm(rsCount)
	for i := 0; len(res) < numOfResults && i < rsCount; i++ {
		index := p[i]
		recipe := rs[index]

		if tags.hasUsedTags(recipe) {
			continue
		}
		res = append(res, recipe)
		tags.add(recipe.Tags)
	}

	return res, nil
}
