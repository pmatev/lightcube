## Generate lightcube patterns and send them to the display

### Dependencies
```
pipenv install
```
Run everything inside a `pipenv shell`

### Generate a fixed frame-rate pattern
```
python generate_pattern.py stripes --format=human
```
Outputs a saved pattern format which can be loaded into the server to send over to the cube.

### Start a websocket server to serve patterns to client
```
python server.py --port=8000
```

This starts a websocket server which serves the data as command events (i.e. one event per frame change)

Test it out easily with something like https://github.com/hashrocket/ws

### Run a pattern
```
server < { "ready": true, "patterns": ["stripes"] }

client > { "pattern": 'stripes' }

server < { "frame": 0, data: {...} }
server < { "frame": 1, data: {...} }
server < { "frame": 2, data: {...} }
```
