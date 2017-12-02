from common import get_input


def main():
    spreadsheet = get_input("2_input")
    checksum = calc_checksum_of_sheet(spreadsheet)
    print(checksum)


def calc_checksum_of_sheet(spreadsheet):
    checksum = 0
    for row in spreadsheet:
        checksum += get_row_checksum(row)
    return checksum


def get_row_checksum(row):
    row_max = None
    row_min = None
    for col in row:
        col_num = int(col)
        if (row_max is None):
            row_max = col_num
            row_min = col_num

        if col_num > row_max:
            row_max = col_num
        if col_num < row_min:
            row_min = col_num

    return row_max - row_min


if __name__ == '__main__':
    main()
