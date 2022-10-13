from SPEECH_RECOGNITION.audio import speech_analyze
import spacy
from spacy_fastlang import LanguageDetector
from spacy.language import Language
from get_results_from_doc import get_results_from_doc
from PATH_FINDER.pathfinder import getAvailableShortPath, getTimeToReachDestination

# STEP 1 : Use microphone to capture voice request and translate it to string
speech_analyze()

# STEP 2 : We feed our spacy model with the string to get origin and destination points
# Define custom factory for language detection since it is not saved to disk atm
@Language.factory("detect_lang")
def get_lang_detector(nlp, name):
    return LanguageDetector()


speech = ""
with open ("speech.txt", "r") as f:
    speech = f.read()

nlp = spacy.load("NLP_COMPONENT/lang_detector_from_to_model")
doc = nlp(speech)
results = get_results_from_doc(doc)
paths_list = getAvailableShortPath(results["from"], results["to"])
paths = " ---> ".join(paths_list)
time = getTimeToReachDestination(results["from"], results["to"])
hours = time // 60

minutes = time % 60

time_string = "{} hrs {} mins".format(hours, minutes)
print(
f"Bonjour Madame/ Monsieur, Pour aller à {results['to']},il vous faudra faire {paths} et cela vous prendra à peu près {time_string} d'après les trajets disponibles."
)