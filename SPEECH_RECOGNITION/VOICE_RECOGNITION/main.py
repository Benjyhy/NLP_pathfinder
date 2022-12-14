import speech_recognition as sr
from classes.Auth import auth
from classes.Listener import listener
from classes.Recorder import recorder

if __name__ == '__main__':
    auth = auth(["Paco", "Benjy", "Bavon"])
    recorder = recorder(auth)
    l = listener(recorder)
    # print('hold ctrl to record, press p to playback, press q to quit')
    l.start()  # keyboard listener is a thread so we start it here
    l.join()  # wait for the tread to terminate so the program doesn't instantly close
    # speech_analyze()
