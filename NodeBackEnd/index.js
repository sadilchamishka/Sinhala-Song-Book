const elasticsearch = require('elasticsearch');
const express = require( 'express' );
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.set( 'port', process.env.PORT);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const client = new elasticsearch.Client({
   hosts: [process.env.ELASTICSEARCH_CLUSTER]
});

client.ping({
     requestTimeout: 30000,
 }, function(error) {
 // at this point, eastic search is down, please check your Elasticsearch service
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });
 

// define the /search route that should return elastic search results 
app.post('/search', function (req, res){

  var tags = [];
  var sortingMethod = ["_score"];
  var bestRates = false;

  req.body.tags.map(tag=>{

    if (tag.id!='track_rating'){
      tags.push(tag.id);
    }

    if (tag.id=='title'){
      tags.push("track_name_en");
    }
    else if (tag.id=='singer'){
      tags.push("artist_name_en");
    }
    else if (tag.id=='track_rating'){
      bestRates = true;
      sortingMethod = [ "_score", {"track_rating" : "desc"} ]
    }
  });

  if (tags.length==2 && bestRates){
      if (tags[0]=='singer'){
        sortingMethod = [{"track_rating" : "desc"} ]
      }
  }
  // declare the query object to search elastic search and return only 200 results from the first result found. 
  // also match any data where the name is like the query string sent in
  let body = {
    from: 0, 
    "size" : 50,
    "sort" : sortingMethod,
    query: {
      multi_match: {
            query: req.body.query,
            fields: tags
      }
    },
    "aggs": {
      "categories": {
        "terms": {
          "field": "singer.keyword"
        }
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:req.body.index,  body:body})
  .then(results => {
    res.send(results);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

});


app.post('/autocomplete', function (req, res){

  let body = {
    query: {
      match_phrase_prefix: {
        "title": {
          "query": req.body.query,
          "slop": 3,
          "max_expansions": 5
      }
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'sinhala_songs',  body:body})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

});

app.get('/landpage', function (req, res){

  let body = {
    "size" : 50,
    query: {
      range: {
        "track_rating":{"gte":7}
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'sinhala_songs',  body:body})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

});


app.get('/singercount', function (req, res){

  let body = {
    "size" : 0,
    "aggs": {
      "categories": {
        "terms": {
          "field": "singer.keyword"
        }
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'sinhala_songs',  body:body})
  .then(results => {
    res.send(results.aggregations.categories.buckets);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

});


// listen on the specified port
app .listen( app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
} );