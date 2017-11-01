from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase
from playhouse.shortcuts import model_to_dict, dict_to_model

db = SqliteExtDatabase('petfeedd.db')

class BaseModel(Model):
    def dict(self):
        return model_to_dict(self)

    class Meta:
        database = db
