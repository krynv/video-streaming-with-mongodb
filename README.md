# Video Streaming Server

Basic example of a video streaming service that utilises MongoDB to store the file we're wanting to stream. The client is able to parse this data and play back the video in a stream.


This project is based on my other example which can be found here:
https://github.com/krynv/video-streaming/ 


```
git clone git@github.com:krynv/video-streaming-with-mongodb.git && npm i
```

Have `docker` & `docker-compose` installed.

```
docker-compose up -d
```

```
curl localhost:8000/init-video
```
^ to instert the video into the DB

Then go to:
http://localhost:8000


## The general gist of this

Expanded version of the project here:
https://github.com/krynv/video-streaming/ 

It utilises MongoDB to store the binary data of the sample video into a document using GridFS.

GridFS splits the document into chunks which allows us to store data larger than the limit of 16MB. 

We can stream this data back to the front end for a seamless experience.




