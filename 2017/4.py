from common import get_input


def main():
    passphrases = get_input("4_input")
    valid_passphrase_count = 0
    for passphrase in passphrases:
        words_in_passphrase = []
        valid = True
        for word in passphrase:
            if word not in words_in_passphrase:
                words_in_passphrase.append(word)
            else:
                valid = False
        if valid:
            valid_passphrase_count += 1
    print(valid_passphrase_count)


if __name__ == '__main__':
    main()
