from common import get_input


def main():
    passphrases = get_input("4_input")
    print(count_valid_passphrases(passphrases))


def count_valid_passphrases(passphrases):
    valid_count1 = valid_count2 = 0
    for passphrase in passphrases:
        valid_count1 += 1 if not has_duplicates(passphrase) else 0
        valid_count2 += 1 if not has_anagrams(passphrase) else 0
    return valid_count1, valid_count2


def has_duplicates(passphrase):
    words_in_passphrase = []
    for word in passphrase:
        if word not in words_in_passphrase:
            words_in_passphrase.append(word)
        else:
            return True
    return False


def has_anagrams(passphrase):
    for i in range(len(passphrase)):
        if check_anagram(passphrase[i], passphrase[i + 1:]):
            return True
    return False


def check_anagram(word, phrases):
    for phrase in phrases:
        if is_anagram(phrase, word):
            return True
    return False


def is_anagram(word1, word2):
    # thanks google: https://stackoverflow.com/questions/38138842/how-to-check-whether-two-words-are-anagrams-python
    return sorted(word1.lower()) == sorted(word2.lower())


if __name__ == '__main__':
    main()
