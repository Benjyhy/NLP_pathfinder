import os
import pickle
import time
from scipy.io.wavfile import read

from main_functions import *

def recognize(filename):
    FILENAME = F"./{filename}.wav"
    MODEL = "gmm_models/voice_auth.gmm"
    VOICEPATH = "./voice_database/"
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
            time.sleep(1.5)
            os.system('cls' if os.name == 'nt' else 'clear')
    
    
    print( "Recognized as - ", identity)
    return
            
    
if __name__ == '__main__':
    recognize()
