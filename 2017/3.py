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


def build_table(max):
    table = [[1]]
    current_value = 0
    x = y = 0
    while current_value < max:
        current_value = table[y][x] = sum_of_neighbours(x, y, table)
        rows = len(table) - 1
        cols = len(table[0]) - 1
        if(cols == rows):
            if (x == cols and y == rows):
                add_col(table)
                x += 1
            elif (x == 0 and y == 0):
                add_col(table, False)
            elif (y == 0):
                x -= 1
            elif (y == rows):
                x += 1
        elif (cols == rows + 1):
            if(x == cols and y == 0):
                add_row(table, False)
            elif (x == 0 and y == rows):
                add_row(table)
                y += 1
            elif (x == 0):
                y += 1
            elif (x == cols):
                y -= 1

    return current_value


def add_row(table, at_end=True):
    cols = len(table[0])
    new_row = [0] * cols
    if (at_end):
        table.append(new_row)
    else:
        table.insert(0, new_row)

    return 0 if at_end else 1


def add_col(table, at_end=True):
    new_col = 0
    rows = len(table)
    for j in range(rows):
        if (at_end):
            table[j].append(0)
        else:
            table[j].insert(0, 0)

    return 0 if at_end else 1


def sum_of_neighbours(x, y, table):
    sum = 0
    for j in range(y - 1, y + 2):
        for i in range(x - 1, x + 2):
            if (i < 0 or j < 0):
                continue
            try:
                sum += table[j][i]
            except IndexError:
                continue
    return sum


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

    max = 368078
    after_max_value = build_table(max)
    print("Maximum value is {} the next one is: {}".format(max, after_max_value))


if __name__ == '__main__':
    main()
