from pynput import keyboard


class listener(keyboard.Listener):
    def __init__(self, recorder):
        super().__init__(on_press=self.on_press)
        self.recorder = recorder

    def on_press(self, key):
        if key is None:  # unknown event
            pass
        elif isinstance(key, keyboard.Key):  # special key event
            if key.ctrl and self.recorder.recording == False:
                print(
                    "First, you will need to say the password to continue using this script")
                self.recorder.start()
        elif isinstance(key, keyboard.KeyCode):  # alphanumeric key event
            if key.char == 'q':  # press q to quit
                return False  # this is how you stop the listener thread
            if key.char == 'p' and not self.recorder.recording:
                self.start()
