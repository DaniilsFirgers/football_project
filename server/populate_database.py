from pymongo import MongoClient
import json
import os

mongo_client = MongoClient("mongodb://localhost:27017/")

db = mongo_client['project_md']
collection = db['football']

def insert_files_into_db():
    try:
        parent_dir = 'C:/Users/dfirg/Desktop/LU/JSON_TestData'
        for subdir, dirs, files in os.walk(parent_dir):
            for file in files:
                file_in_dir = os.path.join(subdir, file)
                with open(file_in_dir) as file_to_read:
                    jsonified_file = json.load(file_to_read)
                collection.insert_one(jsonified_file)
        print("Added data to the database")
    except:
        print("Could not add data to the database.")
    finally:
        mongo_client.close()

insert_files_into_db()