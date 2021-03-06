
def main():
    a = b = c = d = e = f = g = h = 0
    a = 1
    c = b = 99

    if a != 0:
        c = b = (b * 100) + 100000
        c += 17000

    for b in range(b, c + 1, 17):
        print("Test " + str(b))
        h += 0 if isprime(b) else 1

    print(a, b, c, d, e, f, g, h)


def isprime(b):
    for d in range(2, int(b**0.5) + 1):
        if b % d == 0:
            print("NOT prime: {} = {} * {}".format(b, d, b // d))
            return False
    print("is prime {}".format(b))
    return True


if __name__ == '__main__':
    main()


# while True:
#     f = 1
#     # d = 2
#     # while True:
#     #     # e = 2
#     #     # while True:
#     #     #     if (d * e) == b:
#     #     #         f = 0
#     #     #     e += 1
#     #     #     if e == b:
#     #     #         break
#     #     d += 1
#     #     print("3:", a, b, c, d, e, f, g, h)
#     #     if d == b:
#     #         break
#     if f == 0:
#         h += 1
#     # print("2:", a, b, c, d, e, f, g, h)
#     if b == c:
#         break
#     b += 17
#     print("1:", a, b, c, d, e, f, g, h)
