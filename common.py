def get_input(filename, row=None, col=None, func=None):
    '''
    Returns the input files content splitted to rows/columns

    Args:
     - :filename: (str): Name of the file to open
     - :row: (int): the row to return (optional)
     - :col: (int): the column to return (optional)
    '''
    with open(filename, "r") as file:
        file_data = file.readlines()

    output = []
    for line in file_data:
        line = line.split()
        if (callable(func)):
            line = list(map(func, line))
        output.append(line)

    try:
        if (row is not None):
            output = output[row]
            if (col is not None):
                output = output[col]
    except IndexError as e:
        print("Unknown column or row:", e)
    except TypeError as e:
        print("Unknown column or row:", e)
    else:
        return output

    return None
