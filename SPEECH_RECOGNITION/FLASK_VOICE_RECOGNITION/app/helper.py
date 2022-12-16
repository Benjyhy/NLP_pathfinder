import speech_recognition as sr
import os
import uuid
import base64

audio_folder = os.environ.get("AUDIO_FOLDER")
audio_voice_folder = os.environ.get("AUDIO_BIOMETRIC_VOICES_FOLDER")

def decode_and_create_audio(audio, username=''):
    unique_filename = str(uuid.uuid4())
    if not username:
        wav_file = open(f"{audio_folder}{unique_filename}.wav", "wb")
    else:
        if not os.path.exists(f"{audio_voice_folder}{username}"):
            os.makedirs(f"{audio_voice_folder}{username}")
        wav_file = open(f"{audio_voice_folder}{username}/{unique_filename}.wav", "wb")
    decode_string = base64.b64decode(audio)
    wav_file.write(decode_string)
    return unique_filename

def decode_and_create_audio_biometric(audio, ):
    wav_file = open(f"{audio_folder}last_biometric_audio_tested.wav", "wb")
    decode_string = base64.b64decode(audio)
    wav_file.write(decode_string)
    return 'last_biometric_audio_tested'

def recognise(filename):
    r = sr.Recognizer()
    audio = sr.AudioFile(f'{audio_folder}{filename}.wav')
    with audio as source:
        audio = r.record(source)
    try:
        s = r.recognize_google(audio, key=None, language="fr-FR")
        return s
    except Exception as e:
        print("Exception: "+str(e))
        return e

def auth(filename):
    valide_auth = ["paco", "bavon", "benjamin", "trucmuche"]
    r = sr.Recognizer()
    audio = sr.AudioFile(f'{audio_folder}{filename}.wav')
    with audio as source:
        audio = r.record(source)
    try:
        s = r.recognize_google(audio, key=None, language="fr-FR")
        print(s)
        if s not in valide_auth:
            return False
        else: 
            return True
    except Exception as e:
        print("Exception: "+str(e))
        return e