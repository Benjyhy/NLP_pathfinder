import os 
import pickle
import glob
from biometric_auth.main_functions import *
from scipy.io.wavfile import read

audio_voice_folder = os.environ.get("AUDIO_BIOMETRIC_VOICES_FOLDER")
audio_model_folder = os.environ.get("AUDIO_BIOMETRIC_MODEL_FOLDER")

# deletes a registered user from database
def delete_user(name):
    VOICEPATH = f"{audio_voice_folder}"

    users = [ name for name in os.listdir(VOICEPATH) if os.path.isdir(os.path.join(VOICEPATH, name)) ]
    
    if name not in users or name == "unknown":
        return False

    [os.remove(path) for path in glob.glob(VOICEPATH + name + '/*')]
    os.removedirs(VOICEPATH + name)

    if os.path.isfile(f"{audio_model_folder}/voice_auth.gmm"): 
        os.remove(f"{audio_model_folder}/voice_auth.gmm")
        
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


    if os.path.isfile(f"{audio_model_folder}/voice_auth.gmm"): 
        os.remove(f"{audio_model_folder}/voice_auth.gmm")
    # saving model
    pickle.dump(clf, open(f"{audio_model_folder}/voice_auth.gmm", 'wb'))

    return 'User ' + name + ' deleted successfully'
