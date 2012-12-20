#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import os
import jinja2
import webapp2

from google.appengine.api import users
from google.appengine.ext import db

class PortPage(webapp2.RedirectHandler):
	def get(self):
		guserid = users.get_current_user()
		productname = cgi.escape(u'#include <行事曆.h>')
		myurl = self.request.uri
		myhost = self.request.host_url
		usefunc = self.request.get('function')
		if guserid:
			logouturl = cgi.escape(users.create_logout_url(myurl))
			jintemvar = {
				'logouturl': logouturl,
				'productname': productname,
				'googleuser': guserid,
				'myhost': myhost
			}
			
			if not usefunc:
				usefunc = "import"
				
			if usefunc == "import":
				jinhtml = jinenv.get_template('jinhtml/import.html')
			elif usefunc == "export":
				jinhtml = jinenv.get_template('jinhtml/export.html')
			else:
				self.response.set_status(404)
				return
			
		else:
			loginurl = cgi.escape(users.create_login_url(myhost))
			jintemvar = {
				'loginurl': loginurl,
				'productname': productname
			}
			jinhtml = jinenv.get_template('jinhtml/welcome.html')
		
		self.response.out.write(jinhtml.render(jintemvar))
		

jinenv = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))

app = webapp2.WSGIApplication([('/port', PortPage)])
