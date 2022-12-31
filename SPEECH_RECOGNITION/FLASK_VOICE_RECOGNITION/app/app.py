from flask import Flask, jsonify, request, current_app
from flask_cors import CORS, cross_origin
from functools import wraps
from pprint import pprint as pp
import jwt
import os

# Auth import
from helper import *
from biometric_auth.add_user import add_user
from biometric_auth.recognize import recognize
from biometric_auth.delete_user import delete_user

# load env variable for production
from dotenv import load_dotenv

load_dotenv('.env')

#env variables 
user = os.environ.get("USER_AUTH")
userMdp = os.environ.get("USER_MDP")
secret = os.environ.get('FLASK_SECRET_KEY')
token = os.environ.get('TOKEN')
audio_voice_folder = os.environ.get("AUDIO_BIOMETRIC_VOICES_FOLDER")

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
    print(encoded_jwt)

@app.route("/recognise", methods=["POST"])
@isAuthenticated
def recognise_route():
    audio = request.get_json()["audio"]
    filename = decode_and_create_audio(audio)

    sentence = recognise(filename)
    if(sentence == False):
        return jsonify(status=False)
    return jsonify(status=True, sentence=sentence)

@app.route("/basicauth", methods=["POST"])
def basicauth_route():
    audio = request.get_json()["audio"]
    filename = decode_and_create_audio(audio)

    res = auth(filename)
    if res["status"] == True:
        return jsonify(status=True, user=res["user"])

    if res["failed"] == True:
        return jsonify(status=False, failed=True)
    
    if res["failed"] == False:
        return jsonify(status=False, failed=False)


# Biometric Auth
@app.route("/biometric/add", methods=["POST"])
@isAuthenticated
def biometric_add_route():
    audio = request.get_json()["audio"]
    username = request.get_json()["user"]
    if os.path.exists(f"{audio_voice_folder}{username}"):
        return jsonify(status=False, message="User already exist")
    for file in audio:
        decode_and_create_audio(file, username=username)

    res = add_user(username)
    if res:
        return jsonify(status=True)
    else: 
        return jsonify(status=False)


@app.route("/biometric/recognise", methods=["POST"])
def biometric_recognise_route():
    audio = request.get_json()["audio"]
    filename = decode_and_create_audio_biometric(audio)
    res = recognize(filename)
    if res == False:
        return jsonify(status=False)
    else: 
        return jsonify(status=True, user=res, token=token)

@app.route("/biometric/delete", methods=["POST"])
@isAuthenticated
def biometric_delete_route():
    username = request.get_json()["user"]
    if not os.path.exists(f"{audio_voice_folder}{username}"):
        return jsonify(status=False, message=f"User {username} not exist")
    res = delete_user(username)
    if res == False:
        return jsonify(status=False, message=f"User {username} not exist")
    return jsonify(status=True, message=res)
