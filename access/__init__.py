#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from google.appengine.ext import db

class CalEvent(db.Model):
	title = db.StringProperty()
	content = db.StringProperty(required=True, multiline=True)
	icon = db.IntegerProperty()
	begin = db.DateTimeProperty(required=True)
	datafrom = db.StringProperty(required=True)
	remind = db.IntegerProperty()

