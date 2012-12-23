#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import atom
import gdata.service
import gdata.auth
import gdata.alt.appengine
import gdata.calendar
import gdata.calendar.service
import webapp2

from google.appengine.api import users

class FetchGoogleCal (webapp2.RequestHandler) :
	def get (self) :
		client = gdata.calendar.service.CalendarService ()
		gdata.alt.appengine.run_on_appengine (client)
		auth_token = gdata.auth.extract_auth_sub_token_from_url(self.request.uri)
		if not auth_token :
			next_url = self.request.uri
			url = client.GenerateAuthSubURL (next_url, ('http://www.google.com/calendar/feeds/default/',), secure = False)
			self.response.out.write (url)
			return
		else :
			if users.get_current_user () :
				session_token = client.upgrade_to_session_token (auth_token)
				client.token_store.add_token (session_token)
			else :
				client.current_token = auth_token
		# feed_url = 'http://www.google.com/calendar/feeds/' + str (users.get_current_user ()) + '/private/full'
		feed_url = 'https://www.google.com/calendar/feeds/default/allcalendars/full'
		response = client.Get (feed_url, converter = str)
		self.response.out.write (response)
			
		
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

app = webapp2.WSGIApplication ([('/google/fetchgooglecal', FetchGoogleCal)])