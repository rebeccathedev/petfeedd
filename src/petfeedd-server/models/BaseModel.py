import datetime

from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase
from playhouse.shortcuts import model_to_dict, dict_to_model

db = SqliteExtDatabase('petfeedd.db')

class BaseModel(Model):
    date_created = DateTimeField()
    date_updated = DateTimeField()

    def save(self, *args, **kwargs):
        if self._get_pk_value() is None:
            # this is a create operation, set the date_created field
            self.date_created = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S")

        self.date_updated = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S")
        return super(BaseModel, self).save(*args, **kwargs)

    def dict(self):
        return model_to_dict(self)

    class Meta:
        database = db
