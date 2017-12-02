from common import get_input

'''
1122 produces a sum of 3 (1 + 2) because the first digit (1) matches the second digit and the third digit (2) matches
    the fourth digit.
1111 produces 4 because each digit (all 1) matches the next.
1234 produces 0 because no digit matches the next.
91212129 produces 9 because the only digit that matches the next one is the last digit, 9.
'''


def main():
    day1_puzzle = get_input("1_input", 0, 0)
    # day1_puzzle = "91212129"
    sum = 0
    puzzle_len = len(day1_puzzle)
    half_way = int(puzzle_len / 2)
    for i in range(puzzle_len):
        next_index = (i + half_way) % puzzle_len
        if (day1_puzzle[i] == day1_puzzle[next_index]):
            sum += int(day1_puzzle[i])
    print(sum)


if __name__ == '__main__':
    main()
