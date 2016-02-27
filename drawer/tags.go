package drawer

import (
	"github.com/slomek/obiadek/db"
)

// Tags represents a map of tags used when drawing recipes.
type Tags map[string]bool

func (t Tags) add(tags []string) {
	for _, tag := range tags {
		t[tag] = true
	}
}

func (t Tags) hasUsedTags(r db.Recipe) bool {
	for _, tag := range r.Tags {
		_, alreadyIn := t[tag]
		if alreadyIn {
			return true
		}
	}
	return false
}
