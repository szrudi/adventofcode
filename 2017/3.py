import math


def calculate_distance(num):
    next_root = math.ceil(math.sqrt(num))
    next_odd_root = next_root + ((next_root + 1) % 2)
    dist_to_cicrle = next_odd_root // 2

    if dist_to_cicrle == 0:
        return 1

    prev_full_circle = (next_odd_root - 2)**2
    dist_from_circle_start = num - prev_full_circle

    distance_from_middle = dist_from_circle_start % dist_to_cicrle
    quadrant = (dist_from_circle_start - 1) // dist_to_cicrle
    if (quadrant % 2 == 0):
        distance_from_middle = (dist_to_cicrle - distance_from_middle) % dist_to_cicrle
    elif distance_from_middle == 0:
        distance_from_middle == 3

    return dist_to_cicrle + distance_from_middle


def main():
    inputs = [
        (1, 0),
        (12, 3),
        (23, 2),
        (26, 5),
        (1024, 31),
        (52, 5),
        (53, 4),
        (63, 6),
        (72, 7),
        (76, 5),
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
