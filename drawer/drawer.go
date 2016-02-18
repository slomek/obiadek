package drawer

import (
	"fmt"
	"github.com/slomek/obiadek/db"
	"math/rand"
	"time"
)

// Draw returns a list of suggested recipies for upcoming week.
func Draw(d db.Db, n int) ([]db.Recipe, error) {
	res := []db.Recipe{}

	rs, err := d.GetAll()

	if err != nil {
		return res, fmt.Errorf("failed to load recipes from db: %v", err)
	}

	if n < 1 {
		return res, fmt.Errorf("cannot draw non-positive number of recipes")
	}

	rsCount := len(rs)
	if rsCount < n {
		return res, fmt.Errorf("failed to find enough recipes in the database (expected: %d, found: %d)", n, rsCount)
	}

	tagsUsed := make(map[string]bool)

	rand.Seed(time.Now().UnixNano())
	p := rand.Perm(rsCount)
	for i := 0; len(res) < n && i < rsCount; i++ {
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
