import os
import pickle
import time
from scipy.io.wavfile import read

from biometric_auth.main_functions import *

audio_folder = os.environ.get("AUDIO_FOLDER")
audio_voice_folder = os.environ.get("AUDIO_BIOMETRIC_VOICES_FOLDER")
audio_model_folder = os.environ.get("AUDIO_BIOMETRIC_MODEL_FOLDER")

def recognize(filename):
    FILENAME = f"{audio_folder}{filename}.wav"
    MODEL = f"{audio_model_folder}/voice_auth.gmm"
    VOICEPATH = f"{audio_voice_folder}"
    VOICENAMES = [ name for name in os.listdir(VOICEPATH) if os.path.isdir(os.path.join(VOICEPATH, name)) ]


    # load model 
    model = pickle.load(open(MODEL,'rb'))

        # reading audio files of speaker
    (sr, audio) = read(FILENAME)
    
    # extract 40 dimensional MFCC
    vector = extract_features(audio,sr)
    vector = vector.flatten()
    test_audio = vector

    # predict with model
    pred = model.predict(test_audio.reshape(1,-1))

    # decode predictions
    le = preprocessing.LabelEncoder()
    le.fit(VOICENAMES)
    identity = le.inverse_transform(pred)[0]

    # if voice not recognized than terminate the process
    if identity == 'unknown':
        print("Not Recognized! Try again...")
        return False
    
    print( "Recognized as - ", identity)
    return identity
        