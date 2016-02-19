# Obiadek

## Idea

Every Saturday morning I am facing the impossible - choosing what I'm going to cook next week. Time pressure is the worst, as I have to come up with them before going shopping. This application is developed to help me with that, as it feeds me with some ideas.

## Installation

First, you need to get this app:

    go get github.com/slomek/obiadek
    
## Usage

There is currently one major prerequisite, which is MongoDB database. The application is looking for _obiadek_ database by default and _przepisy_ collection (yep, those names will change for sure) on _localhost_. 

To run the app just call:

    $GOBIN/obiadek
    
By default it will draw five suggestions that have unique tags.

### Available options

You can modify that default behaviour with parameters:

- `-n` (type `int`) - numer of suggestions to be drawn (default: `5`)
- `-db` (type `string`) - MongoDB database URL (default: `localhost/obiadek`)
- `-db-timeout` (type `time.Duration`) - timeout for database connection, useful for testing with remoteeremote db (default: `10s`)

## Recipes schema

Recipe has a following database schema:

    {
        // Name of the recipe
        name: String,
        
        // List of tags for the recipe
        tags: Array[string]
    }

### Loading test database

There is a JSON file with recipes that can be loaded into the database:

    mongoimport --drop --db obiadek --collection przepisy --jsonArray < data/sample.json

## Upcoming changes

* [ ] Add ingredients, generate shopping list
* [ ] Excluding recently cooked meals 
* [ ] Adding current preferences (force include tags, exclude tag)
* [ ] Trello integration

