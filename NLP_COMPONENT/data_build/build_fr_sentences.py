import random
import json

base_path = "data/chunks/"

root_sentence_path = f"{base_path}root_sentence.json"
from_part_of_speech_path = f"{base_path}from_part_of_speech.json"
to_part_of_speech_path = f"{base_path}to_part_of_speech.json"
locations_path = f"{base_path}locations.json"

all_paths = [
    root_sentence_path, 
    from_part_of_speech_path, 
    locations_path,
    to_part_of_speech_path, 
    locations_path
]

all_fr_sentences = []

for i in range(3000):
    full_sentence = ""
    for path in all_paths:
        with open(path, "r", encoding="utf-8") as f:
            read_file = json.load(f)
            random_n = random.randint(1,len(read_file) - 1)
            full_sentence += read_file[random_n]
            full_sentence += " "
    full_sentence.strip()
    all_fr_sentences.append(full_sentence)

with open("data/lang/fr.json", "a+", encoding="utf-8") as outfile:
    json.dump(all_fr_sentences, outfile)