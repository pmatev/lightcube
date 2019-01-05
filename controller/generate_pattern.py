import sys
from argparse import ArgumentParser
from importlib import import_module

parser = ArgumentParser()
parser.add_argument(
    '--dimensions',
    type=lambda x: [int(i) for i in x.split(',')],
    default=[10, 10, 10],
    help='e.g. 10,12,13'
)
parser.add_argument('--time-steps', type=int, default=10)
parser.add_argument('--format', choices=('json', 'human'), default='json')
parser.add_argument('pattern', type=str)
args = parser.parse_args()

try:
    module = import_module(f'patterns.generators.{args.pattern}')
except ModuleNotFoundError:
    print(f'No generator with name "{args.pattern}" found. Please define one in patterns/generators/{args.pattern}.py')
    sys.exit(1)


data = module.generate(
    x=args.dimensions[0],
    y=args.dimensions[1],
    z=args.dimensions[2],
    time_steps=args.time_steps
)

filename = f'./patterns/outputs/{args.pattern}.{args.format}'
data.save(filename, format=args.format)
print(f'saved file to {filename}')
