package drawer

import (
	"fmt"
	"github.com/slomek/obiadek/db"
	"math/rand"
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

	p := rand.Perm(rsCount)
	for i := 0; i < n; i++ {
		index := p[i]
		res = append(res, rs[index])
	}

	return res, nil
}
