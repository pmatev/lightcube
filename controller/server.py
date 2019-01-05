from sanic import Sanic
from sanic.websocket import WebSocketProtocol
import json
from argparse import ArgumentParser

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
    parser = ArgumentParser()
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--host', type=str, default='0.0.0.0')
    args = parser.parse_args()

    app.run(host=args.host, port=args.port, protocol=WebSocketProtocol)
