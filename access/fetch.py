#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import webapp2

from google.appengine.api import users
from google.appengine.ext import db

from lxml import etree

def XMLBuildCalEvent(calevent, entry):
	newdata = etree.SubElement(calevent, 'key')
	newdata.text = str(entry.key())
	newdata = etree.SubElement(calevent, 'title')
	newdata.text = entry.title
	newdata = etree.SubElement(calevent, 'content')
	newdata.text = entry.content
	newdata = etree.SubElement(calevent, 'icon')
	newdata.text = str(entry.icon)
	newdata = etree.SubElement(calevent, 'beginyear')
	newdata.text = str(entry.beginyear)
	newdata = etree.SubElement(calevent, 'beginmonth')
	newdata.text = str(entry.beginmonth)
	newdata = etree.SubElement(calevent, 'begindate')
	newdata.text = str(entry.begindate)
	newdata = etree.SubElement(calevent, 'endyear')
	newdata.text = str(entry.endyear)
	newdata = etree.SubElement(calevent, 'endmonth')
	newdata.text = str(entry.endmonth)
	newdata = etree.SubElement(calevent, 'enddate')
	newdata.text = str(entry.enddate)
	newdata = etree.SubElement(calevent, 'datafrom')
	newdata.text = entry.datafrom

class FetchEvent(webapp2.RequestHandler):
	def get(self):		# GET 適用於已知 key 的狀況
		mykey = self.request.get('key')
		eventroot = etree.Element('inccalender')
		calevent = etree.SubElement(eventroot, 'calevent')
		entrykey = db.Key(mykey)
		entry = db.get(entrykey)
		XMLBuildCalEvent(calevent, entry)

		self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
		self.response.out.write(
			etree.tostring(eventroot, pretty_print=True, xml_declaration=True,
				encoding='UTF-8'))

	def post(self):		# POST 適用於需要查詢的情況，要提供年月
		guserid = users.get_current_user()
		if not guserid:
			return

		byear = self.request.get('byear')
		bmonth = self.request.get('bmonth')
		data = db.GqlQuery("SELECT * FROM CalEvent "
					"WHERE ANCESTOR IS :1 ORDER BY begindate",
					db.Key.from_path('user', guserid.email()))

		eventroot = etree.Element('inccalender')
		for entry in data:
			calevent = etree.SubElement(eventroot, 'calevent')
			XMLBuildCalEvent(calevent, entry)
	
		self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
		self.response.out.write(
			etree.tostring(eventroot, pretty_print=True, xml_declaration=True,
				encoding='UTF-8'))




app = webapp2.WSGIApplication([('/access/fetch', FetchEvent)])
