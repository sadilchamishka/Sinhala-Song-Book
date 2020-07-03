# Sinhala-Song-Book

Sinhala song search engine enrich with over 10000 sinhala songs corpus 

## Table of contents
* [Technologies](#technologies)
* [Corpus](#corpus)
* [Setup](#setup)
	
## Technologies
Project is created with:
* Elasticsearch version: 7.6
* Node version: 8.10.0
* React version: 16.13.1

## Corpus
[lyricslk.com](http://lyricslk.com/)
### Attributes
1. `track_id` - track identifier
2. `track_name_en` - track name in Singlish
3. `track_name_si` - track name in Sinhala (using Sinhala unicode)
4. `track_rating` - track rating
5. `album_name_en` - album name in Singlish
6. `album_name_si` - album name in Sinhala (using Sinhala unicode)
7. `artist_name_en` - artist name in Singlish
8. `artist_name_si` - artist name in Sinhala (using Sinhala unicode)
9. `artist_rating` - artist rating
10. `lyrics` - Sinhala lyrics of the song (using Sinhala unicode)

[sinhalajukebox.org](http://www.sinhalajukebox.org/)
### Attributes
1. `track_id` - track identifier
2. `title` - song title in Singlish
3. `Duration` - format of HH:MM:SS
4. `Lyricist` - lyricist in Singlish
5. `Tune Composer` - tune composer in Singlish
6. `Lyrics` - Sinhala lyrics as image of type gif

## Setup
Execute the data scraping scripts or use the uploaded corpus.

Create Elasticsearch instance and index, execute the data migration script to upload the documents.

Clone the repository

```
$ git clone https://github.com/sadilchamishka/Sinhala-Song-Book.git
```
Setup Express Server
```
$ cd NodeBackEnd
$ npm install
$ npm start
```
Setup React Server
```
$ cd ReactFrontEnd
$ npm install
$ npm start
```
