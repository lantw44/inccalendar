#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import datetime
import webapp2

from google.appengine.api import users
from google.appengine.ext import db

from access import CalEvent

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
		thisbegin = datetime.datetime (
		year = thisbeginyear,
		month = thisbeginmonth,
		day = thisbegindate
		);
		thisdatafrom = self.request.get('datafrom')

		newcalevent = CalEvent(
		db.Key.from_path('user', guserid.email()),
		content = thiscontent,
		begin = thisbegin,
		datafrom = thisdatafrom
		)

		newcalevent.title = thistitle
		newcalevent.icon = thisicon

		newcalevent.put()

app = webapp2.WSGIApplication([('/access/insert', InsertEvent)])

