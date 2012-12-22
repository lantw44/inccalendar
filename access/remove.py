#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import webapp2

from google.appengine.api import users
from google.appengine.ext import db

class RemoveEvent(webapp2.RequestHandler):
	def get(self):
		return
	def post(self):
		guserid = users.get_current_user()
		if not guserid:
			return
		thiskey = db.Key(self.request.get('key'))
		if thiskey.parent().name() != guserid.email():
			self.response.set_status(403)
			return
		thisobj = db.get(thiskey)
		thisobj.delete()

app = webapp2.WSGIApplication([('/access/remove', RemoveEvent)])
