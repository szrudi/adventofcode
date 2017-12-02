from common import get_input


def main():
    day1_puzzle = get_input("1_input", 0, 0)
    # day1_puzzle = "91212129"

    puzzle_len = len(day1_puzzle)
    half_way = int(puzzle_len / 2)
    sum_part1 = sum_part2 = 0

    for i in range(puzzle_len):
        next_index = (i + 1) % puzzle_len
        if (day1_puzzle[i] == day1_puzzle[next_index]):
            sum_part1 += int(day1_puzzle[i])

        next_index = (i + half_way) % puzzle_len
        if (day1_puzzle[i] == day1_puzzle[next_index]):
            sum_part2 += int(day1_puzzle[i])

    print(sum_part1, sum_part2)


if __name__ == '__main__':
    main()
