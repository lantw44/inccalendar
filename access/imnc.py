#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import webapp2
from StringIO import StringIO
from datetime import datetime, timedelta

from ntuceiba import NtuCeibaEvent
from ntuceiba.parse import ntuceiba_parser
from ntuceiba.toxml import ntuceiba_toxml
from access import CalEvent

from google.appengine.api import users
from google.appengine.ext import db

def ntuceiba_merge(listobj, useremail, allow_overwrite):
	for entry in listobj:
		if entry.duedate == None:
			continue

		data = db.GqlQuery("SELECT * FROM CalEvent "
				"WHERE ANCESTOR IS :1 AND "
				"begin >= :2 AND "
				"begin < :3 "
				"ORDER BY begin",
				db.Key.from_path('user', useremail), 
				entry.duedate,
				entry.duedate + timedelta(0, 3600, 0))

		for matched in data.run():
			if matched.datafrom == "ntuceiba" and matched.title.find(entry.title) >= 0:
				if allow_overwrite:
					entry.key = str(matched.key())
				else:
					entry.enabled = False
				break

def ntuceiba_gaeds_update(listobj, useremail, fakencobj, titleadd):
	listlen = len(listobj)
	createlen = 0
	updatelen = 0
	for entry in listobj:
		if entry.enabled:
			contstr = "\n"
			if entry.key != None:
				calevent = db.get(db.Key(entry.key))
				updatelen = updatelen + 1
			else:
				calevent = CalEvent(
					db.Key.from_path('user', useremail),
					# 我在亂打...... 這個不重要
					content="\n", begin=datetime(1, 1, 1), datafrom="ntuceiba")
				createlen = createlen + 1

			if titleadd == None or titleadd == "":
				calevent.title = entry.title
			else:
				calevent.title = "[" + titleadd + "]" + " " + entry.title
			
			calevent.begin = entry.duedate
			calevent.icon = 0
			calevent.remind = 30
			calevent.datafrom = "ntuceiba"
			
			if fakencobj.title:
				contstr = contstr + u"名稱：" + entry.title + "\n"
			if fakencobj.member:
				contstr = contstr + u"成員：" + entry.member + "\n"
			if fakencobj.method:
				contstr = contstr + u"繳交方法：" + entry.method + "\n"
			if fakencobj.percent:
				contstr = contstr + u"成績比重：" + entry.percent + "\n"
			if fakencobj.duedate:
				contstr = contstr + u"繳交期限：" + str(entry.duedate) + "\n"
			if fakencobj.late:
				if entry.late:
					contstr = contstr + u"逾期繳交：可以\n" 
				else:
					contstr = contstr + u"逾期繳交：不可以\n" 
			if fakencobj.subdate:
				contstr = contstr + u"繳交日期：" + entry.subdate + "\n"
			if fakencobj.comment:
				contstr = contstr + u"作業評語：" + entry.comment + "\n"

			calevent.content = contstr
			calevent.put()
	
	return (listlen, createlen, updatelen)


class NtuCeibaImport(webapp2.RedirectHandler):
	def get(self):
		return
	def post(self):
		guserid = users.get_current_user()
		if not guserid:
			return

		merge = self.request.get('merge')
		viewonly = self.request.get('viewonly')
		overwrite = self.request.get('overwrite')
		htmlfile = self.request.get('file')
		useremail = guserid.email()
		htmlfile = StringIO(htmlfile)
		htmlfile.readline()
		cblist = ntuceiba_parser(htmlfile)

		enflag = NtuCeibaEvent()
		enflag.flagize()
		if self.request.get('addtitle') != "":
			enflag.title = True
		if self.request.get('addmember') != "":
			enflag.member = True
		if self.request.get('addmethod') != "":
			enflag.method = True
		if self.request.get('addpercent') != "":
			enflag.percent = True
		if self.request.get('adddue') != "":
			enflag.duedate = True
		if self.request.get('addlate') != "":
			enflag.late = True
		if self.request.get('addsub') != "":
			enflag.subdate = True
		if self.request.get('addcomment') != "":
			enflag.comment = True


		if merge != "":
			if overwrite != "":
				ntuceiba_merge(cblist, useremail, True)
			else:
				ntuceiba_merge(cblist, useremail, False)

		if viewonly != "":
			self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
			self.response.out.write(ntuceiba_toxml(cblist))
		else:
			resrepo = ntuceiba_gaeds_update(cblist, useremail, enflag, None)
			self.response.headers['Content-Type'] = 'text/plain'
			self.response.out.write(
				str(resrepo[0]) + " " + 
				str(resrepo[1]) + " " +
				str(resrepo[2]))
		

app = webapp2.WSGIApplication([('/access/imnc', NtuCeibaImport)])
