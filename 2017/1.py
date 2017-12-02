from common import get_input


def main():
    day1_puzzle = get_input("1_input", 0, 0)
    # day1_puzzle = "91212129"

    puzzle_len = len(day1_puzzle)
    sums = {
        "part1": {
            "step": 1,
            "sum": 0
        },
        "part2": {
            "step": int(puzzle_len / 2),
            "sum": 0
        }
    }

    for i in range(puzzle_len):
        for part, data in sums.items():
            next_index = (i + data["step"]) % puzzle_len
            if (day1_puzzle[i] == day1_puzzle[next_index]):
                data["sum"] += int(day1_puzzle[i])

    print(sums["part1"]["sum"], sums["part2"]["sum"])


if __name__ == '__main__':
    main()
