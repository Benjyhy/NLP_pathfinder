import os
import pickle
from scipy.io.wavfile import read
from biometric_auth.main_functions import *

def add_user(name):
    
    VOICEPATH = "biometric_auth/voice_database/"
    
    source = VOICEPATH + name
    
    # Train model with the new and old voices in database
    voice_dir = [ name for name in os.listdir(VOICEPATH) if os.path.isdir(os.path.join(VOICEPATH, name)) ]
    X = []
    Y = []
    for name in voice_dir:
        source = f"{VOICEPATH}{name}"
        for path in os.listdir(source):
                path = os.path.join(source, path)

                # reading audio files of speaker
                (sr, audio) = read(path)
                
                # extract 40 dimensional MFCC
                vector = extract_features(audio,sr)
                vector = vector.flatten()
                X.append(vector)
                Y.append(name)
    X = np.array(X, dtype=object)

    le = preprocessing.LabelEncoder()
    le.fit(Y)
    Y_trans = le.transform(Y)
    clf = LogisticRegression(random_state=0).fit(X.tolist(), Y_trans)


    if os.path.isfile("biometric_auth/gmm_models/voice_auth.gmm"): 
        os.remove("biometric_auth/gmm_models/voice_auth.gmm")
    # saving model
    pickle.dump(clf, open('biometric_auth/gmm_models/voice_auth.gmm', 'wb'))
    print(name + ' added successfully') 
    return True
    

