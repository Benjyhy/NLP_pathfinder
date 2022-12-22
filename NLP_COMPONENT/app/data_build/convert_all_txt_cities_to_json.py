import json

number_of_files = 69
all_cities = []

for i in range(69):
    with open (f"data/cities/{i+1}.txt", "r", encoding="utf-8") as f:
        cities = f.read().split("\n\n")
        for city in cities:
            if len(city) != 0:
                all_cities.append(city)

with open("data/chunks/locations.json", "w", encoding="utf-8") as outfile:
    json.dump(all_cities, outfile)