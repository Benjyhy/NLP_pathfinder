from flask import Flask, jsonify, request, current_app
from flask_cors import CORS
from functools import wraps
from pprint import pprint as pp
import jwt
import os

# NLP import 
import spacy
from spacy_fastlang import LanguageDetector
from spacy.language import Language

# load env variable for production
from dotenv import load_dotenv

load_dotenv('.env')

#env variables 
user = os.environ.get("USER_AUTH")
userMdp = os.environ.get("USER_MDP")
secret = os.environ.get('FLASK_SECRET_KEY')
token = os.environ.get('TOKEN')
nlp_folder = os.environ.get('NLP_FOLDER')

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

def get_results_from_doc(doc):
    result = {}
    if (doc._.language != "fr") :
        return result
    for ent in doc.ents:
        if ent.label_ == "FROM_LOC":
            result["from"] = ent.text
        if ent.label_ == "TO_LOC":
            result["to"] = ent.text
    return result

@app.route("/recommendation", methods=["POST"])
@isAuthenticated
def recommendation_route():
    speech = request.get_json()["sentence"]

    @Language.factory("detect_lang")
    def get_lang_detector(nlp, name):
        return LanguageDetector()

    nlp = spacy.load(f"{nlp_folder}")
    doc = nlp(speech)
    results = get_results_from_doc(doc)
    return jsonify(status=True, result=results)


