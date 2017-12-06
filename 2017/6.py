from common import get_input


def main():
    memory_banks = get_input("6_input", 1, func=int)
    print(memory_banks)

    saved_states = {}
    cycle = 0

    key = ",".join(map(str, memory_banks))
    while key not in saved_states.keys():
        saved_states[key] = cycle
        redistribute_blocks(memory_banks)
        cycle += 1
        key = ",".join(map(str, memory_banks))

    print(len(saved_states), len(saved_states) - saved_states[key])


def redistribute_blocks(memory_banks):
    block_count = max(memory_banks)
    block_index = memory_banks.index(block_count)
    memory_banks[block_index] = 0
    for i in range(block_count):
        index = (block_index + 1 + i) % (len(memory_banks))
        memory_banks[index] += 1


if __name__ == '__main__':
    main()
