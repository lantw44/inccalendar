#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from google.appengine.ext import db

class Event(db.Model):
	title = db.StringProperty (required=True)
	description = db.TextProperty ()
	time = db.DateTimeProperty ()
	location = db.TextProperty ()
	creator = db.UserProperty ()