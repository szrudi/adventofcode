def calculate_distance(num):
    return num


def main():
    inputs = [
        (1, 0),
        (12, 3),
        (23, 2),
        (1024, 31),
        (368078, None)
    ]
    for num, result in inputs:
        dist = calculate_distance(num)
        if (result is not None):
            print("{num} distance should be {result}. Calculated: {dist}"
                  .format(num=num, result=result, dist=dist))
        else:
            print("{num} calculated distance is: {dist}"
                  .format(num=num, dist=dist))


if __name__ == '__main__':
    main()
