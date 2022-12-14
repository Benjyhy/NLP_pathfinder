import speech_recognition as sr


# obtain audio from the microphone
def speech_analyze():
    r = sr.Recognizer()
    s = sr.Microphone.list_microphone_names()
    for lol in s:
        print("\n\n" + lol )
    micro = sr.Microphone()
    with micro as source:
        print("Please wait. Calibrating microphone...")
        # listen for 5 seconds and create the ambient noise energy level
        r.adjust_for_ambient_noise(source, duration=5)
        print("Say something!")
        
        audio = r.listen(source)


    try:
        result = r.recognize_google(audio, key=None, language="fr-FR")
        print(result)
        print("Skynet thinks you said '" + result + "'")
        with open('speech.txt', 'w'):
            pass
        with open("speech.txt", "a") as file:
            file.write(result)
    except sr.UnknownValueError:
        print("Skynet could not understand audio")
    except sr.RequestError as e:
        print("Skynet error; {0}".format(e))

speech_analyze()