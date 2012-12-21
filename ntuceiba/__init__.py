#!/usr/bin/env python
# -*- coding: UTF-8 -*-

class NtuCeibaEvent:
	def __init__(self):
		self.title = ""
		self.member = ""
		self.method = ""
		self.percent = ""
		self.duedate = None
		self.late = False
		self.subdate = None
		self.comment = ""
		self.red = False
	def setred(self, boolval):
		if boolval == True:
			self.red = True
