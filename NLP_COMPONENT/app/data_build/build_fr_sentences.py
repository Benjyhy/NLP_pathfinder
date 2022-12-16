import random
import json

base_path = "data/chunks/"

root_sentence_path = f"{base_path}root_sentence.json"
from_part_of_speech_path = f"{base_path}from_part_of_speech.json"
to_part_of_speech_path = f"{base_path}to_part_of_speech.json"
locations_path = f"{base_path}locations.json"

paths_config_1 = [
    root_sentence_path, 
    from_part_of_speech_path, 
    locations_path,
    to_part_of_speech_path, 
    locations_path
]

paths_config_2 = [
    root_sentence_path, 
    to_part_of_speech_path, 
    locations_path,
    from_part_of_speech_path, 
    locations_path
]

all_fr_sentences = []

for i in range(200):
    full_sentence = ""
    for path in paths_config_2:
        with open(path, "r", encoding="utf-8") as f:
            read_file = json.load(f)
            random_n = random.randint(1,len(read_file) - 1)
            full_sentence += read_file[random_n]
            full_sentence += " "
    full_sentence.strip()
    all_fr_sentences.append(full_sentence)

for fr_sentence in all_fr_sentences:
    with open("data/lang/fr_v2.txt", "a+", encoding="utf-8") as outfile:
        outfile.write(fr_sentence + "\n\n")