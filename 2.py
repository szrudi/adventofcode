from common import get_input


def main():
    spreadsheet = get_input("2_input", func=int)
    checksum_dist, checksum_div = calc_checksum_of_sheet(spreadsheet)
    print(checksum_dist, checksum_div)


def calc_checksum_of_sheet(spreadsheet):
    checksum_dist = checksum_div = 0
    for row in spreadsheet:
        checksum_dist += get_row_dist_checksum(row)
        checksum_div += get_row_div_checksum(row)
    return (checksum_dist, checksum_div)


def get_row_div_checksum(row):
    for i in range(len(row)):
        for j in range(i + 1, len(row)):
            if (row[i] % row[j] == 0):
                return int(row[i] / row[j])
            elif (row[j] % row[i] == 0):
                return int(row[j] / row[i])
    return 0


def get_row_dist_checksum(row):
    row_max = None
    row_min = None
    for col in row:
        if (row_max is None):
            row_max = row_min = col
        elif col > row_max:
            row_max = col
        elif col < row_min:
            row_min = col

    return row_max - row_min


if __name__ == '__main__':
    main()
