from flask import Flask, jsonify, request, current_app
from flask_cors import CORS
from functools import wraps
from pprint import pprint as pp
import jwt
import os

# pathfinder import 
from pathfinder import getAvailableShortPath, getTimeToReachDestination

# load env variable for production
from dotenv import load_dotenv

load_dotenv('.env')

#env variables 
user = os.environ.get("USER_AUTH")
userMdp = os.environ.get("USER_MDP")
secret = os.environ.get('FLASK_SECRET_KEY')
token = os.environ.get('TOKEN')

app = Flask(__name__)
app.secret_key = secret
app.config.from_object(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

#middleware for auth
def isAuthenticated(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not request.headers.get('Authorization'):
            return {'message': 'No token provided'},400
        try:
            token = request.headers.get('Authorization')[7:]
            payload = jwt.decode(token, secret, algorithms=["HS256"], options={'verify_exp': False})

            if not payload["mdp"] == userMdp:
                return { 'status': 'false', 'message':'Invalid token provided.'},400
        except Exception as e:
            print(e)
            return { 'status': 'false', 'message':'Error with token'},400
        return current_app.ensure_sync(func)(*args, **kwargs)
    return wrapper

def generate_cookie():
    encoded_jwt = jwt.encode({"user": user, "mdp" : userMdp}, secret, algorithm="HS256").decode("utf-8")
    # print(encoded_jwt)

@app.route("/pathfinder", methods=["POST"])
@isAuthenticated
def pathFinder_route():
    departure = request.get_json()["departure"]
    arrival = request.get_json()["arrival"]

    paths_list = getAvailableShortPath(departure, arrival)

    if paths_list == False:
        return jsonify(status=True, message="not found")
    if paths_list == 0:
        return jsonify(status=False, message="no trip" )
    time = getTimeToReachDestination(departure, arrival)

    hours = time // 60
    minutes = time % 60
    time_string = "{} hrs {} mins".format(hours, minutes)

    return jsonify(status=True, paths=paths_list, time=time_string)



