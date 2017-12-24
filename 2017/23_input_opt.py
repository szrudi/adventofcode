
a = b = c = d = e = f = g = h = 0
a = 1
c = b = 99

if a != 0:
    c = b = (b * 100) + 100000
    c += 17000
while True:
    f = 1
    d = 2
    while True:
        e = 2
        while True:
            g = (d * e) - b
            if g == 0:
                f = 0
            e += 1
            g = e - b
            # print("4:", a, b, c, d, e, f, g, h)
            if g == 0:
                break
        d += 1
        g = d - b
        print("3:", a, b, c, d, e, f, g, h)
        if g == 0:
            break
    if f == 0:
        h += 1
    g = b - c
    print("2:", a, b, c, d, e, f, g, h)
    if g == 0:
        break
    b += 17
    print("1:", a, b, c, d, e, f, g, h)

print(a, b, c, d, e, f, g, h)
