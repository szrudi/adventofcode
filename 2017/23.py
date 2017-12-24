from common import get_input
day18 = __import__("18")


class Day23(day18.Process):
    def __init__(self, instructions):
        super(Day23, self).__init__(instructions)
        self.mul_count = 0

    def jnz(self, x, y):
        if self.get_value(x) != 0:
            self.log("Jumping {} instructions".format(y))
            self.current_inst += (y - 1)
        else:
            self.log("Not jumping, register {} is {}".format(x, self.get_value(x)))

    def sub(self, x, y):
        ''' decrease register X by the value of Y '''
        self.log("Sub {} from register {}".format(y, x))
        self.registers[x] = self.get_value(x) - y

    def mul(self, x, y):
        super(Day23, self).mul(x, y)
        self.mul_count += 1


def main():
    instructions = get_input('23_input')
    d = Day23(instructions)
    d.run()
    print(d.mul_count)
    print(d.registers)


if __name__ == '__main__':
    main()
