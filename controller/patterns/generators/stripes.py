from patterns import Pattern


def generate(x=10, y=10, z=10, time_steps=10):
    return Pattern(data=[
        [[[calculate_rgb(x, y, z, t) for zi in range(z)] for yi in range(y)] for xi in range(x)]
        for t in range(time_steps)
    ])


def calculate_rgb(x, y, z, t):
    if t % 2:
        return (1, 1, 1)
    else:
        return (0, 0, 0)
