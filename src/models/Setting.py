from peewee import *

from models.BaseModel import BaseModel

class Setting(BaseModel):
    key = CharField(unique=True)
    value = CharField()
