import requests
from bs4 import BeautifulSoup

ds = "https://www.listedemots.com/liste-villes-france_page-"
number_of_pages = 69

def extract_cities(url, filename):
    file = f"data/cities/{filename}.txt"
    s = requests.get(url)
    soup = BeautifulSoup(s.text, "lxml")
    cities = soup.find_all("span", {"class": "mot"})
    with open (file, "a+", encoding="utf-8") as f:
        for city in cities:
            f.write(str(city.get_text()) + "\n\n")

for i in range(69):
    extract_cities(f"{ds}{i+1}", i+1)