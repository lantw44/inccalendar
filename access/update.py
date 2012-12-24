import cgi
import datetime
import webapp2

from google.appengine.api import users
from google.appengine.ext import db

from access import CalEvent

class UpdateEvent (webapp2.RequestHandler) :
	def get (self) :
		return
	def post (self) :
		guserid = users.get_current_user()
		if not guserid:
			return
		mykey = self.request.get('key')
		mykeyobj = db.Key(mykey)
		if mykeyobj.parent().name() != guserid.email():
			self.response.set_status(403)
			return
		
		thisicon = int(self.request.get('icon'))
		thistitle = self.request.get('title')
		thiscontent = self.request.get('content')
		thisbeginyear = int(self.request.get('year'))
		thisbeginmonth = int(self.request.get('month'))
		thisbegindate = int(self.request.get('date'))
		thisbeginhour = int(self.request.get('hour'))
		thisbeginminute = int(self.request.get('minute'))
		thisbegin = datetime.datetime (
		year = thisbeginyear,
		month = thisbeginmonth,
		day = thisbegindate,
		hour = thisbeginhour,
		minute = thisbeginminute
		);
		thisdatafrom = self.request.get('datafrom')
		thisremind = None
		try:
			thisremind = int(self.request.get('remind'))
		except:
			pass
		
		eventdata = db.get(mykey)
		eventdata.icon = thisicon
		eventdata.title = thistitle
		eventdata.content = thiscontent
		eventdata.begin = thisbegin
		eventdata.datafrom = thisdatafrom
		eventdata.remind = thisremind
		
		eventdata.put()
		
app = webapp2.WSGIApplication([('/access/update', UpdateEvent)])
