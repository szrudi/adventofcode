from common import get_input


def main():
    spreadsheet = get_input("2_input", func=int)
    checksum = calc_checksum_of_sheet(spreadsheet)
    print(checksum)


def calc_checksum_of_sheet(spreadsheet):
    checksum = 0
    for row in spreadsheet:
        checksum += get_row_dist_checksum(row)
    return checksum


def get_row_dist_checksum(row):
    row_max = None
    row_min = None
    for col in row:
        if (row_max is None):
            row_max = row_min = col

        if col > row_max:
            row_max = col
        if col < row_min:
            row_min = col

    return row_max - row_min


if __name__ == '__main__':
    main()
