#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import webapp2
import datetime

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
	newdata = etree.SubElement(calevent, 'year')
	newdata.text = str(entry.begin.year)
	newdata = etree.SubElement(calevent, 'month')
	newdata.text = str(entry.begin.month)
	newdata = etree.SubElement(calevent, 'date')
	newdata.text = str(entry.begin.day)
	newdata = etree.SubElement(calevent, 'hour')
	newdata.text = str(entry.begin.hour)
	newdata = etree.SubElement(calevent, 'minute')
	newdata.text = str(entry.begin.minute)
	newdata = etree.SubElement(calevent, 'remind')
	newdata.text = str(entry.remind)
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

		year = int(self.request.get('year'))
		month = int(self.request.get('month'))
		withcursor = self.request.get('gqlcursor')
		if month >= 12:
			nextmonth = 1
			nextyear = year + 1
		else:
			nextmonth = month + 1
			nextyear = year

		data = db.GqlQuery("SELECT * FROM CalEvent "
					"WHERE ANCESTOR IS :1 AND "
					"begin >= :2 AND "
					"begin < :3 "
					"ORDER BY begin",
					db.Key.from_path('user', guserid.email()),
					datetime.datetime(year, month, 1),
					datetime.datetime(nextyear, nextmonth, 1))

		if withcursor != "":
			data.with_cursor(withcursor)

		eventroot = etree.Element('inccalender')
		for entry in data.run(limit=50):
			calevent = etree.SubElement(eventroot, 'calevent')
			XMLBuildCalEvent(calevent, entry)

		gqlcursor = etree.SubElement(eventroot, 'gqlcursor')
		gqlcursor.text = data.cursor()
	
		self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
		self.response.out.write(
			etree.tostring(eventroot, pretty_print=True, xml_declaration=True,
				encoding='UTF-8'))

app = webapp2.WSGIApplication([('/access/fetch', FetchEvent)])
