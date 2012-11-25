#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import os
import jinja2
import webapp2

from google.appengine.api import users
from google.appengine.ext import db

class MainPage(webapp2.RedirectHandler):
	def get(self):
		guserid = users.get_current_user()
		productname = cgi.escape(u'#include <行事曆.h>')
		if guserid:
			logouturl = cgi.escape(users.create_logout_url(self.request.uri))
			jintemvar = {
				'logouturl': logouturl,
				'productname': productname,
				'googleuser': guserid
			}
			jinhtml = jinenv.get_template('jinhtml/month.html')
			
		else:
			loginurl = cgi.escape(users.create_login_url(self.request.uri))
			jintemvar = {
				'loginurl': loginurl,
				'productname': productname
			}
			jinhtml = jinenv.get_template('jinhtml/welcome.html')
		
		self.response.out.write(jinhtml.render(jintemvar))
		

jinenv = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))

app = webapp2.WSGIApplication([('/', MainPage)])