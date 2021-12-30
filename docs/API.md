# petfeedd API

petfeedd exposes a web API that can be used to build third-party clients. The
API is REST/JSON. The web interface in fact uses the API.

## The PUT Request

You can use `PUT` on the root of the endpoint in question to make bulk changes.
By posting an array with changes (additions, updates, deletes), petfeedd will
resolve the changes and make the contents look correct.

## Events

These endpoints are concerned with manipulating the events list that shows
which feeds have happened. You really shouldn't have much need to use these
endpoints other than the first one.

```
GET    /api/events
POST   /api/events
PUT    /api/events
GET    /api/events/:id
POST   /api/events/:id
DELETE /api/events/:id
```

### Data Format

```json
{
  "id": 1,
  "name": "New Feed (On Demand)",
  "size": 1,
  "date_created": "2021-12-30T01:59:45.707Z",
  "date_updated": "2021-12-30T01:59:45.707Z"
}
```

## Feeds

These endpoints are concerned with manipulating the feed scheduler and
triggering feeds.

```
GET    /api/feeds
POST   /api/feeds
PUT    /api/feeds
GET    /api/feeds/:id
GET    /api/feeds/:id/feed
POST   /api/feeds/:id
DELETE /api/feeds/:id
```

### Data Format

```json
{
  "id": 1,
  "time": "20:50",
  "servo_id": 1,
  "name": "New Feed",
  "size": 1,
  "feed_count": 0,
  "last_feed": null,
  "date_created": "2021-12-30T01:50:04.012Z",
  "date_updated": "2021-12-30T01:50:04.012Z"
}
```

### Notes

To manually trigger a feed, call `GET /api/feeds/:id/feed`.

## Servos

These endpoints are concerned with manipulating servos.

```
GET    /api/servos
POST   /api/servos
PUT    /api/servos
GET    /api/servos/:id
POST   /api/servos/:id
DELETE /api/servos/:id
```

### Data Format

```json
{
  "id": 1,
  "name": "Default",
  "pin": 17,
  "feed_time": 0.25,
  "date_created": "2021-12-29T22:26:48.367Z",
  "date_updated": "2021-12-29T22:26:48.367Z"
}
```

## Buttons

These endpoints are concerned with manipulating buttons.

```
GET    /api/buttons
POST   /api/buttons
PUT    /api/buttons
GET    /api/buttons/:id
POST   /api/buttons/:id
DELETE /api/buttons/:id
```

### Data Format

```json
{
  "id": 1,
  "pin": 17,
  "servo_id": 1,
  "default_feed_size": 1,
  "date_created": "2021-12-30T02:05:13.464Z",
  "date_updated": "2021-12-30T02:05:13.464Z"
}
```

## MQTT

These endpoints are concerned with manipulating MQTT listen events.

```
GET    /api/mqtt
POST   /api/mqtt
PUT    /api/mqtt
GET    /api/mqtt/:id
POST   /api/mqtt/:id
DELETE /api/mqtt/:id
```

### Data Format

```json
{
  "id": 1,
  "event": "New/Listen/Event",
  "servo_id": 1,
  "default_feed_size": 1,
  "date_created": "2021-12-30T02:06:33.944Z",
  "date_updated": "2021-12-30T02:06:33.944Z"
}
```

## Sounds

```
GET    /api/sounds
POST   /api/sounds
PUT    /api/sounds
GET    /api/sounds/:id
POST   /api/sounds/:id
DELETE /api/sounds/:id
```

### Data Format

```json
{
  "id": 1,
  "sound": "door-chime.mp3",
  "event": "",
  "date_created": "2021-12-30T02:10:58.867Z",
  "date_updated": "2021-12-30T02:10:58.867Z"
}
```

### Notes

When creating sounds, you must use `multipart/form-data`. The first part should
be called `file.0` and contain the file being uploaded. The second part should
be called `body` and should contain the JSON to create the sound. The JSON body
for creating a sound should contain a `file` field that contains an `int`
representing

```json
{
  "event": "feed.completed",
  "sound": null,
  "file": 0
}
```

## Settings

These endpoints update various settings across the feeder.

```
GET    /api/settings
POST   /api/settings
PUT    /api/settings
GET    /api/settings/:id
POST   /api/settings/:id
DELETE /api/settings/:id
```

### Data Format

```json
{
  "id": 1,
  "key": "name",
  "value": "petfeedd",
  "namespace": "general",
  "type": "string",
  "date_created": "2021-12-29T22:26:48.372Z",
  "date_updated": "2021-12-29T22:26:48.372Z"
}
```

### Notes

Some of the keys supported:

```
namespace  key                  type
---------  -------------------  ------
mqtt       enable               bool
mqtt       server               string
mqtt       broadcast_event      string
general    name                 string
zeroconf   enable               bool
general    paused               bool
twitter    enable               bool
twitter    consumer_key         string
twitter    consumer_secret      string
twitter    bearer_token         string
twitter    message_format       string
twitter    access_token_key     string
twitter    access_token_secret  string
email      enable               bool
email      from                 string
email      from_address         string
email      subject              string
email      to                   string
email      server               string
email      port                 number
email      username             string
email      password             string
email      secure               bool
```

## Util

These are some miscellaneous endpoints that provide additional functionality not
provided by other endpoints.

```
GET    /api/util/emailtest
```
Sends a test email.
```
GET    /api/util/reload
```
Reloads all core functionality.
```
GET    /api/util/reload/:type
```
Reloads functionality for a specific core type. Valid types:

* `bonjour`
* `buttons`
* `email`
* `feeder`
* `mqtt`
* `scheduler`
* `sounds`
* `twitter`
* `web`

```
GET    /api/util/shutdown
```
Shuts down the feeder.
