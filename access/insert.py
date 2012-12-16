#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import datetime
import webapp2

from google.appengine.api import users
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

class InsertEvent(webapp2.RequestHandler):
	def get(self):
		return
	def post(self):
		guserid = users.get_current_user()
		if not guserid:
			return
		thisicon = int(self.request.get('icon'))
		thistitle = self.request.get('title')
		thiscontent = self.request.get('content')
		thisbeginyear = int(self.request.get('beginyear'))
		thisbeginmonth = int(self.request.get('beginmonth'))
		thisbegindate = int(self.request.get('begindate'))
		thisendyear = int(self.request.get('endyear'))
		thisendmonth = int(self.request.get('endmonth'))
		thisenddate = int(self.request.get('enddate'))
		thisdatafrom = self.request.get('datafrom')

		newcalevent = CalEvent(
		db.Key.from_path('user', guserid.email()),
		content = thiscontent,
		beginyear = thisbeginyear,
		beginmonth = thisbeginmonth,
		begindate = thisbegindate,
		endyear = thisendyear,
		endmonth = thisendmonth,
		enddate = thisenddate,
		datafrom = thisdatafrom
		)

		newcalevent.title = thistitle
		newcalevent.icon = thisicon

		newcalevent.put()

app = webapp2.WSGIApplication([('/access/insert', InsertEvent)])

