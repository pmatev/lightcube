import json


class Pattern:
    def __init__(self, data):
        self.data = data
        self.frames = len(data)

    def _save_human(self, filename):
        with open(filename, 'w') as f:
            for fi, frame in enumerate(self.data):
                f.write(f'--- frame: {fi}\n')
                for xi, x in enumerate(frame):
                    for yi, y in enumerate(x):
                        for zi, z in enumerate(y):
                            f.write(f'coords: ({xi},{yi},{zi}) rgb: {z}\n')

    def _save_json(self, filename):
        with open(filename, 'w') as f:
            json.dump(self.data, f)

    def save(self, filename, format='json'):
        if format == 'json':
            self._save_json(filename)
        elif format == 'human':
            self._save_human(filename)
        else:
            raise Exception(f'unknown format given "{format}"')

    def load(self, filename):
        pass
