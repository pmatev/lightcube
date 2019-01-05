from sanic import Sanic
from sanic.websocket import WebSocketProtocol
import json

app = Sanic()

instructions = []
with open('./test_seq.txt', 'r') as f:
    instructions = [int(line) for line in f.readlines()]

print(instructions)


@app.websocket('/feed')
async def feed(request, ws):
    for line in instructions:
        data = json.dumps({'value': line})
        print('Sending: ' + data)
        await ws.send(data)
        resp = await ws.recv()
        print('Received: ' + resp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, protocol=WebSocketProtocol)