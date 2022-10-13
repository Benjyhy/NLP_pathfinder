import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import re

datas = pd.read_csv('PATH_FINDER/timetables.csv', sep='\t')
# print(datas.head())

s = pd.Series(datas['trajet'])
series = s.str.split(r" - ", expand=True)

departures = series[0]
destinations = series[1]
datas = datas.join(departures)
datas = datas.join(destinations)

datas = datas.rename(columns={0: "departures", 1: "destinations", "duree":"weight"})

G_gares = nx.from_pandas_edgelist(datas, source="departures", target="destinations", edge_attr='weight')

def checkDestination(dep, dest, first, second):
    dep = dep.capitalize()
    dest = dest.capitalize()
    for u in G_gares.nodes():
        first.append(u)
    for v in G_gares.nodes():
        second.append(v)

    allee = list(filter(lambda x: dep in x, first))

    arrivee = list(filter(lambda x: dest in x, second))

    return (allee, arrivee)


def getAvailableShortPath(departure, destination):

    departure_list = []
    destination_list = []
    #vérification si le départ ou l'arrivée est bien un mot raisonnable en excluant des mots vides et ceux avec une longueur
    # inférieure ou égale à 3

    if departure == "" or len(departure) <= 3:
        print("Désolé Madame/Monsieur, on n'a pas saisi votre lieu de départ, Pouvez-vous réessayer ultérieurement?")

    elif destination == "" or len(destination) <= 3:
        print("Désolé Madame/Monsieur, on n'a pas saisi votre lieu d'arrivée, Pouvez-vous réessayer ultérieurement?")
    # verifier si le mot inséré est contenue dans l'une des gares qu'on a dans le dataset

    else:
        # récupérer tous les gares correspondant au mot inséré
        depart, arrivee = checkDestination(departure, destination, departure_list, destination_list)

        if len(depart)==0 or len(arrivee)==0:
            print("Désolé Madame/Monsieur, nous n'avons aucun trajet correspondant à votre demande!")

        for k in depart:
            for l in arrivee:
                couple = (k,l)
                short_path = nx.shortest_path(G_gares)
                court = short_path[couple[0]][couple[1]]
                return court

def getTimeToReachDestination(depature, destination):
    short_path = getAvailableShortPath(depature, destination)
    time_list = []
    for index, elem in enumerate(short_path):
        if index+1 == len(short_path):
            break
    #         prev_el = str(Lille[index-1])
        curr_el = elem
        next_el = short_path[index+1]

        time = nx.path_weight(G_gares, [curr_el, next_el], weight="weight")
        time_list.append(time)
    return sum(time_list)