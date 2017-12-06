from common import get_input


def main():
    memory_banks = get_input("5_input", 0, func=int)
    print(memory_banks)
    block_count = max(memory_banks)
    block_index = memory_banks.index(block_count)
    memory_banks[block_index] = 0
    for i in range(block_count):
        index = (block_index + 1 + i) % (len(memory_banks))
        memory_banks[index] += 1
    print(memory_banks)


if __name__ == '__main__':
    main()
