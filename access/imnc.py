#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import webapp2
from StringIO import StringIO

from ntuceiba import NtuCeibaEvent
from ntuceiba.parse import ntuceiba_parser
from ntuceiba.toxml import ntuceiba_toxml

from google.appengine.api import users
from google.appengine.ext import db

class NtuCeibaImport(webapp2.RedirectHandler):
	def get(self):
		return
	def post(self):
		viewonly = self.request.get('viewonly')
		htmlfile = self.request.get('file')
		if viewonly != "":
			htmlfile = StringIO(htmlfile)
			htmlfile.readline()
			cblist = ntuceiba_parser(htmlfile)
			self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
			self.response.out.write(ntuceiba_toxml(cblist))
		

app = webapp2.WSGIApplication([('/access/imnc', NtuCeibaImport)])
