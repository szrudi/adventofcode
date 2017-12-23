from common import get_input


class Duet:
    def __init__(self, instructions):
        self.instructions = instructions
        self.current_inst = 0
        self.registers = {}
        self.last_played = 0

    def run(self):
        try:
            while True:
                inst = self.instructions[self.current_inst]
                func = getattr(self, inst[0])
                if len(inst) > 2:
                    arg2 = self.get_value(inst[2])
                else:
                    arg2 = ""

                ret = func(inst[1], arg2)
                if ret is not None:
                    break
                self.current_inst += 1
                self.print_registers()
        except ValueError as e:
            print("Exception: " + str(e))

    def get_value(self, y):
        try:
            return int(y)
        except ValueError:
            pass

        try:
            return self.registers[y]
        except KeyError:
            return 0

    def snd(self, x, _):
        ''' plays a sound with a frequency equal to the value of X. '''
        sound = self.get_value(x)
        print("Playing sound: " + str(sound))
        self.last_played = sound

    def set(self, x, y):
        ''' set X Y sets register X to the value of Y. '''
        print("Set register {} to {}".format(x, y))
        self.registers[x] = y

    def add(self, x, y):
        ''' increases register X by the value of Y. '''
        print("Add {} to register {}".format(y, x))
        self.registers[x] = self.get_value(x) + y

    def mul(self, x, y):
        ''' sets register X to the result of multiplying the value contained in register X by the value of Y. '''
        print("Multiply registers {} value with {}".format(x, y))
        self.registers[x] = self.get_value(x) * y

    def mod(self, x, y):
        ''' sets register X to the remainder of dividing the value contained in register X by the value of Y
        (that is, it sets X to the result of X modulo Y). '''
        print("Mod registers {} with {}".format(x, y))
        self.registers[x] = self.get_value(x) % y

    def rcv(self, x, _):
        ''' recovers the frequency of the last sound played, but only when the value of X is not zero.
        (If it is zero, the command does nothing.) '''
        if self.get_value(x) != 0:
            print("Last played sound is: " + str(self.last_played))
            return self.last_played
        else:
            print("Nothing to recover, register {} is 0".format(x))

    def jgz(self, x, y):
        ''' jumps with an offset of the value of Y, but only if the value of X is greater than zero.
        (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.) '''
        jmp = self.get_value(y)
        if self.get_value(x) != 0:
            print("Jumping {} instructions".format(jmp))
            self.current_inst += jmp - 1
        else:
            print("Not jumping, register {} is 0".format(x))

    def print_registers(self):
        if len(self.registers) > 0:
            for key, value in self.registers.items():
                print(key + ': ' + str(value))


def main():
    print("Test run")
    test = get_input('18_test')
    test = Duet(test)
    test.run()

    print("\nDuet: ")
    instructions = get_input('18_input')
    d = Duet(instructions)
    d.run()


if __name__ == '__main__':
    main()
