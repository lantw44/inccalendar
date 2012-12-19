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
		thisbeginyear = int(self.request.get('year'))
		thisbeginmonth = int(self.request.get('month'))
		thisbegindate = int(self.request.get('date'))
		thisbeginhour = int(self.request.get('hour'))
		thisbeginminute = int(self.request.get('minute'))
		thisbegin = datetime.datetime (
		year = thisbeginyear,
		month = thisbeginmonth,
		day = thisbegindate,
		hour = thisbeginhour,
		minute = thisbeginminute
		);
		thisdatafrom = self.request.get('datafrom')
		thisremind = int(self.request.get('remind'))

		newcalevent = CalEvent(
		db.Key.from_path('user', guserid.email()),
		content = thiscontent,
		begin = thisbegin,
		datafrom = thisdatafrom
		)

		newcalevent.title = thistitle
		newcalevent.icon = thisicon
		newcalevent.remind = thisremind

		newcalevent.put()

		self.response.headers['Content-Type'] = 'text/plain'
		self.response.out.write(str(newcalevent.key()))

app = webapp2.WSGIApplication([('/access/insert', InsertEvent)])

