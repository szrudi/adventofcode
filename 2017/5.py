from common import get_input


def main():
    data = flatten_list(get_input('5_input', func=int))
    # data = [0, 3, 0, 1, -3]
    steps = 0
    index = 0
    try:
        while True:
            offset = data[index]
            if offset >= 3:
                data[index] -= 1
            else:
                data[index] += 1
            index += offset
            steps += 1
    except IndexError:
        pass
    print(steps)


def flatten_list(data):
    return [item for sublist in data for item in sublist]


if __name__ == '__main__':
    main()
