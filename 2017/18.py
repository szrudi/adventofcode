from common import get_input

VERBOSE = False


class Duet:
    def __init__(self, instructions):
        self.instructions = instructions
        self.current_inst = 0
        self.registers = {}
        self.last_played = 0
        self.run_counter = 0

    def run(self):
        self.run_counter = 0
        try:
            while True:
                if VERBOSE:
                    print()
                self.run_counter += 1

                inst = self.instructions[self.current_inst]
                func = getattr(self, inst[0])
                arg1 = inst[1]
                arg2 = "" if len(inst) < 3 else self.get_value(inst[2])

                ret = func(arg1, arg2)

                self.current_inst += 1
                self.log("Registers: {}".format(self.registers))

                if type(ret) is bool:
                    return ret

                if self.current_inst < 0:
                    raise IndexError("Negative indexes not allowed now...")

        except IndexError as e:
            self.log("Exception: " + str(e))

        return True

    def get_value(self, y):
        try:
            return int(y)
        except ValueError as e:
            pass

        try:
            return self.registers[y]
        except KeyError:
            return 0

    def snd(self, x, _):
        ''' plays a sound with a frequency equal to the value of X. '''
        sound = self.get_value(x)
        self.log("Playing sound: " + str(sound))
        self.last_played = sound

    def set(self, x, y):
        ''' set X Y sets register X to the value of Y. '''
        self.log("Set register {} to {}".format(x, y))
        self.registers[x] = y

    def add(self, x, y):
        ''' increases register X by the value of Y. '''
        self.log("Add {} to register {}".format(y, x))
        self.registers[x] = self.get_value(x) + y

    def mul(self, x, y):
        ''' sets register X to the result of multiplying the value contained in register X by the value of Y. '''
        self.log("Multiply {} registers value with {}".format(x, y))
        self.registers[x] = self.get_value(x) * y

    def mod(self, x, y):
        ''' sets register X to the remainder of dividing the value contained in register X by the value of Y
        (that is, it sets X to the result of X modulo Y). '''
        self.log("Mod register {} with {}".format(x, y))
        self.registers[x] = self.get_value(x) % y

    def rcv(self, x, _):
        ''' recovers the frequency of the last sound played, but only when the value of X is not zero.
        (If it is zero, the command does nothing.) '''
        if self.get_value(x) != 0:
            self.log("Last played sound is: " + str(self.last_played))
            return True
        else:
            self.log("Nothing to recover, register {} is 0".format(x))

    def jgz(self, x, y):
        ''' jumps with an offset of the value of Y, but only if the value of X is greater than zero.
        (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.) '''
        if self.get_value(x) > 0:
            self.log("Jumping {} instructions".format(y))
            self.current_inst += (y - 1)
        else:
            self.log("Not jumping, register {} is {}".format(x, self.get_value(x)))

    def log(self, msg):
        if VERBOSE:
            print(msg)


class Process(Duet):
    max_id = 0

    def __init__(self, instructions):
        super(Process, self).__init__(instructions)

        self.id = self.max_id
        Process.max_id += 1
        self.set('p', self.id)
        self.queue = Queue()
        self.queue.register(self.id)

    def reset():
        Process.max_id = 0

    def log(self, msg):
        if VERBOSE:
            print("P{}: {}".format(self.id, msg))

    def snd(self, x, _):
        ''' sends the value of X to the other program. '''
        send_value = self.get_value(x)
        send_id = (self.id + 1) % 2
        self.log("Sending value {} to P{}".format(send_value, send_id))
        self.queue.add(send_id, send_value)

    def rcv(self, x, _):
        ''' receives the next value and stores it in register X '''
        received = self.queue.pop(self.id)
        if received is None:
            self.current_inst -= 1  # do not step forward
            self.log("Waiting to receive from other process.")
            return False
        else:
            self.log("Received value {} from other process, storing in register '{}'"
                     .format(received, x))
            self.set(x, received)
            return None


class Queue:
    queues = {}

    def reset():
        Queue.queues = {}

    def register(self, id):
        self.queues[id] = {
            'msg_received': 0,
            'queue': []
        }

    def add(self, id, value):
        self.queues[id]['queue'].append(value)
        self.queues[id]['msg_received'] += 1
        self.print_stat()

    def pop(self, id):
        try:
            value = self.queues[id]['queue'].pop(0)
        except IndexError:
            return None
        else:
            self.print_stat()
            return value

    def print_stat(self):
        if VERBOSE:
            for id, data in self.queues.items():
                print("    P{} received {} messages, queue: {}"
                      .format(id, data['msg_received'], data['queue']))


def run_parallel(instructions):
    Queue.reset()
    Process.reset()
    print("\nProcesses: ")
    p0 = Process(instructions)
    p1 = Process(instructions)
    p0_done = p1_done = False
    while True:
        if not p0_done:
            p0_done = p0.run()
        if not p1_done:
            p1_done = p1.run()

        print("Counters: P{p0.id}-{p0.run_counter} P1-{p1.run_counter}".format(p0=p0, p1=p1))
        print("Done: P{}-{} P{}-{}".format(p0.id, p0_done, p1.id, p1_done))

        if (p0_done and p1_done) or p1.run_counter == p0.run_counter == 1:
            print("Done!")
            Queue().print_stat()
            break

        if Queue.queues[0]['msg_received'] > 10000 or Queue.queues[1]['msg_received'] > 10000:
            print("Too much to take.")
            break


def main():
    print("Test run")
    test = get_input('18_test')
    test = Duet(test)
    test.run()

    print("\nDuet: ")
    instructions = get_input('18_input')
    d = Duet(instructions)
    d.run()

    run_parallel(get_input('18_test2'))
    run_parallel(get_input('18_input'))


if __name__ == '__main__':
    main()
