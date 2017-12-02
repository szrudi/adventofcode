def get_input(filename):
    with open(filename, "r") as file:
        file_data = file.readlines()

    split_data = []
    for line in file_data:
        split_data.append(line.split())
    return split_data
