from peewee import *

from models.BaseModel import BaseModel

class Feed(BaseModel):
    time = TimeField()
    name = CharField()
    size = IntegerField(default=0)
    feed_count = BigIntegerField(default=0)
    last_feed = DateTimeField(null = True)
