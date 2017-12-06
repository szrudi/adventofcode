from common import get_input


def main():
    data = flatten_list(get_input('5_input', func=int))
    # data = [0, 3, 0, 1, -3]
    steps = 0
    index = 0
    try:
        while True:
            # print(data)
            data[index] += 1
            index += data[index] - 1
            steps += 1
    except IndexError:
        pass
    print(data)
    print(steps)


def flatten_list(data):
    return [item for sublist in data for item in sublist]


if __name__ == '__main__':
    main()
