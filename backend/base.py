from flask import Flask, request
from flask_cors import CORS


import json
import pandas 


api = Flask(__name__)
CORS(api)

@api.route('/tracks', methods=["POST"])
def savetofile():
    df = pandas.json_normalize(request.json)
    print(df)

    return "received"
