#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from google.appengine.ext import db

class CalEvent(db.Model):
	title = db.StringProperty()
	content = db.StringProperty(required=True, multiline=True)
	icon = db.IntegerProperty()
	beginyear = db.IntegerProperty(required=True)
	beginmonth = db.IntegerProperty(required=True)
	begindate = db.IntegerProperty(required=True)
	endyear = db.IntegerProperty(required=True)
	endmonth = db.IntegerProperty(required=True)
	enddate = db.IntegerProperty(required=True)
	datafrom = db.StringProperty(required=True)

