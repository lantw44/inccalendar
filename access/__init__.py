#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from google.appengine.ext import db

class CalEvent(db.Model):
	title = db.StringProperty(required=True)
	content = db.StringProperty(multiline=True)
	icon = db.IntegerProperty()
	begin = db.DateTimeProperty(required=True)
	datafrom = db.StringProperty(required=True)
	remind = db.IntegerProperty()

