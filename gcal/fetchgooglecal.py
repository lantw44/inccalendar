#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import atom
import gdata.service
import gdata.auth
import gdata.alt.appengine
import gdata.calendar
import gdata.calendar.service
import webapp2
import datetime

from google.appengine.api import users
from google.appengine.ext import db

from access import CalEvent

class FetchGoogleCal (webapp2.RequestHandler) :
	def get (self) :
		client = gdata.calendar.service.CalendarService ()
		gdata.alt.appengine.run_on_appengine (client)
		auth_token = gdata.auth.extract_auth_sub_token_from_url(self.request.uri)
		if auth_token :
			if users.get_current_user () :
				client.token_store.add_token (client.upgrade_to_session_token (auth_token))
			else :
				client.current_token = auth_token
		# if not client.GetAuthSubToken :
		else :
			next_url = self.request.uri
			url = client.GenerateAuthSubURL (next_url, ('http://www.google.com/calendar/feeds/',), secure = False, session = True)
			self.response.out.write (url)
			return
		guserid = users.get_current_user ()
		if guserid :
			feed = client.GetCalendarEventFeed ()
			for i, event in enumerate (feed.entry) :
				for when in event.when :
					starttime = when.start_time.split ('T')
					
					date = starttime[0].split ('-')
					time = starttime[1].split (':')
					
					for i in range (0, len (date)) :
						date[i] = unicode (date[i])
					for i in range (0, len (time)) :
						time[i] = unicode (time[i])
					
					year = int (date[0])
					month = int (date[1])
					day = int (date[2])
					hour = int (time[0])
					minute = int (time[1])
					
					begintime = datetime.datetime (
					year = year,
					month = month,
					day = day,
					hour = hour,
					minute = minute
					)
					
					newcalevent = CalEvent (
					db.Key.from_path('user', guserid.email()),
					title = unicode (event.title.text),
					begin = begintime,
					datafrom = 'google'
					)
					event.content.text = unicode (event.content.text, "utf-8")
					newcalevent.content = event.content.text
					
					newcalevent.put ()
			self.redirect (self.request.host_url, permanent = True)
		
		# token_request_url = gdata.auth.generate_auth_sub_url (self.request.uri, ('http://www.google.com/calendar/feeds/default/',))
		# auth_token = gdata.auth.extract_auth_sub_token_from_url (token_request_url)
		# if users.get_current_user () :
			# self.calendar_client.token_store.add_token (auth_token)
		# if not isinstance (self.calendar_client.token_store.find_token ('http://www.google.com/calendar/feeds/', gdata.auth.AuthSubToken)) :
			# token_request_url = gdata.auth.generate_auth_sub_url (self.request.uri, ('http://www.google.com/calendar/feeds/default/',))
			# auth_token = gdata.auth.extract_auth_sub_token_from_url (token_request_url)
			# session_token = self.calendar_client.upgrade_to_session_token (auth_token)
			# if users.get_current_user () :
				# self.calendar_client.token_store.add_token (session_token)
		# else :
			# session_token = self.calendar_client.token_store.find_token ('http://www.google.com/calendar/feeds/', gdata.auth.AuthSubToken)
		# self.calendar_client.setAuthSubToken (session_token)
		# feed = self.calendar_client.get_all_calendars_feed ()
		# self.response.out.write (auth_token)

app = webapp2.WSGIApplication ([('/gcal/fetchgooglecal', FetchGoogleCal)])
