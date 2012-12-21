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
		self.subdate = ""
		self.comment = ""
		self.red = False
		self.enabled = True
		self.key = None
	def flagize(self):
		self.title = False
		self.member = False
		self.method = False
		self.percent = False
		self.duedate = False
		self.late = False
		self.subdate = False
		self.comment = False
		self.red = False
		self.enabled = False
		self.key = False
	def setred(self, boolval):
		if boolval == True:
			self.red = True
