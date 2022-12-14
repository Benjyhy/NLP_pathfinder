from threading import Thread, Lock
import speech_recognition as sr


class recorder():
    def __init__(self, auth):
        self.recognizer = sr.Recognizer()
        self.micro = sr.Microphone()
        self.auth = auth
        self.lock = Lock()
        self.recording = False

    def authentication(self):
        with self.lock:
            self.recording = True
        with self.micro as source:
            print("Please wait. Calibrating microphone...")
            # listen for 5 seconds and create the ambient noise energy level
            self.recognizer.adjust_for_ambient_noise(source, duration=3)
            print("Tell us the required password")
            audio = self.recognizer.listen(source)
            try:
                mdp = self.recognizer.recognize_google(
                    audio, key=None, language="fr-FR")
            # handle the exceptions
            except sr.UnknownValueError:
                print("Google Speech Recognition system could not understand your \
                instructions please give instructions carefully")
                print("Press q key to quit")
                return

            except sr.RequestError as e:
                print("Could not request results from Google Speech Recognition\
                service; {0}".format(e))
                print("Press q key to quit")
                return
            authResult = self.auth.checkingMdp(mdp)
            if not authResult:  # If not auth, user need to press enter again to retry
                self.recording = False
        self.run()

    def run(self):
        with self.lock:
            self.recording = True
        with self.micro as source:
            print("Please wait. Calibrating microphone...")
            # listen for 5 seconds and create the ambient noise energy level
            self.recognizer.adjust_for_ambient_noise(source, duration=3)
            print("Tell us your itinerary")
            audio = self.recognizer.listen(source)
            itinerary = self.recognizer.recognize_google(
                audio, key=None, language="fr-FR")

        try:
            print("Skynet thinks you said '" + itinerary + "'")
            with open("speech.txt", "a") as file:
                file.write(itinerary)
        except sr.UnknownValueError:
            print("Skynet could not understand audio")
            print("Press q key to quit")
        except sr.RequestError as e:
            print("Skynet error; {0}".format(e))
            print("Press q key to quit")

    def start(self):
        Thread(target=self.authentication).start()
