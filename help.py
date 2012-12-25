#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi
import os
import jinja2
import webapp2

from jinja2 import TemplateNotFound
from google.appengine.api import users

class HelpPage(webapp2.RedirectHandler):
	def get(self):
		guserid = users.get_current_user()
		productname = cgi.escape(u'#include <行事曆.h>')
		myurl = self.request.uri
		myhost = self.request.host_url
		page = self.request.get('page')
		if page == "":
			page = 'index'

		if guserid:
			logouturl = cgi.escape(users.create_logout_url(myurl))
			jintemvar = {
				'logouturl': logouturl,
				'logouttext': u'登出',
				'productname': productname,
				'googleuser': guserid,
				'myhost': myhost
			}
			
		else:
			logouturl = cgi.escape(users.create_login_url(myurl))
			jintemvar = {
				'logouturl': logouturl,
				'logouttext': u'登入',
				'productname': productname,
				'googleuser': u'未登入',
				'myhost': myhost
			}
		
		try:
			jinhtml = jinenv.get_template('help/' + page + '.html')
			self.response.out.write(jinhtml.render(jintemvar))
		except TemplateNotFound:
			self.response.set_status(404)
			self.response.out.write(u'抱歉，查無此文件。')
		

jinenv = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))

app = webapp2.WSGIApplication([('/help', HelpPage)])
