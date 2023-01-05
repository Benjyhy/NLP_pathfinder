import speech_recognition as sr
import os
import uuid
import base64
import librosa
import soundfile as sf


# load env variable for production
from dotenv import load_dotenv
load_dotenv('.env')

audio_folder = os.environ.get("AUDIO_FOLDER")
audio_voice_folder = os.environ.get("AUDIO_BIOMETRIC_VOICES_FOLDER")

def convertMp3ToWav(filename, username=False):
    if username != False:  
        os.system(f"yes yes | ffmpeg -i {audio_voice_folder}{username}/{filename}.mp3 {audio_voice_folder}{username}/{filename}.wav")
        os.remove(f"{audio_voice_folder}{username}/{filename}.mp3")
    else:
        os.system(f"ffmpeg -i {audio_folder}{filename}.mp3 {audio_folder}{filename}.wav")
        os.remove(f"{audio_folder}{filename}.mp3")
        data, sr = librosa.load(f"{audio_folder}{filename}.wav", sr=None, mono=False)
        trimmed = librosa.util.fix_length(data, int(sr * 2))
        sf.write(f"{audio_folder}{filename}.wav", trimmed, 44100)

def decode_and_create_audio(audio, username=''):
    unique_filename = str(uuid.uuid4())
    decode_string = base64.b64decode(audio)
    if not username:
        print("in")
        wav_file = open(f"{audio_folder}{unique_filename}.mp3", "wb")
        wav_file.write(decode_string)
        convertMp3ToWav(unique_filename)
    else:
        if not os.path.exists(f"{audio_voice_folder}{username}"):
            os.makedirs(f"{audio_voice_folder}{username}")
        wav_file = open(f"{audio_voice_folder}{username}/{unique_filename}.mp3", "wb")
        wav_file.write(decode_string)
        convertMp3ToWav(unique_filename, username)
    return unique_filename

def decode_and_create_audio_biometric_recognize(audio):
    wav_file = open(f"{audio_folder}last_biometric_audio_tested.mp3", "wb")
    decode_string = base64.b64decode(audio)
    wav_file.write(decode_string)
    convertMp3ToWav("last_biometric_audio_tested")
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
        return False

def auth(filename):
    valide_auth = ["j'aime le chocolat", "Paco", "Bavon", "Benjamin", "Trucmuche"]
    r = sr.Recognizer()
    audio = sr.AudioFile(f'{audio_folder}{filename}.wav')
    with audio as source:
        audio = r.record(source)
    try:
        s = r.recognize_google(audio, key=None, language="fr-FR")
        print('AUTHHHHHHHHHHHHHHHHHHHHHHH')
        print(s)
        if s not in valide_auth:
            return {"status": False, "failed": False}
        else: 
            return {"status": True, "failed": False, "user": s}
    except Exception:
        return {"status": False, "failed": True} 