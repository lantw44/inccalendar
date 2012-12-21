#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from datetime import datetime, timedelta
from lxml import etree
from ntuceiba import NtuCeibaEvent

class nccolinfo:
	def __init__(self):
		self.red = False
		self.url = None
		self.data = ""

def ntuceiba_readcol(etrele):
	rval = nccolinfo()
	if etrele.text:
		rval.data = etrele.text
	elif etrele[0].tag == 'a':
		subele = etrele[0]
		rval.url = subele.get('href')
		if subele.text:
			rval.data = subele.text
		else:
			rval.data = subele[0].text
			rval.red = True
	elif etrele[0].tag == 'font':
		subele = etrele[0]
		if subele.text:
			rval.data = subele.text
			rval.red = True
		elif subele[0].tag == 'a':
			rval.url = subele[0].get('href')
			rval.data = subele[0].text
			rval.red = True
	return rval

def ntuceiba_parsedate(instr):
	if instr == '--':
		return None
	
	try:
		dyear = int(instr[0:4])
		dmonth = int(instr[5:7])
		ddate = int(instr[8:10])
		dhour = int(instr[11:13])
	except ValueError:
		return None
	
	if dhour == 24:
		rval = datetime(dyear, dmonth, ddate, 0)
		rval = rval + timedelta(1, 0, 0)
	else:
		rval = datetime(dyear, dmonth, ddate, dhour)

	return rval
		

def ntuceiba_parser(fileobj):  # 如果第一行是亂七八糟的東西，請先自行讀掉
	rval = []
	htmlparser = etree.HTMLParser(encoding='UTF-8')
	htmltree = etree.parse(fileobj, htmlparser)
	htmlroot = htmltree.getroot()	
	for hwarea in htmlroot.iter():	# 找出作業的位置
		if hwarea.tag == 'div' and hwarea.get('id') == 'sect_cont':
			break
	else:
		return None
	
	allrow = []
	for item in hwarea.iter():
		if item.tag == 'tr':
			allrow.append(item)

	if len(allrow) > 0:  
		allrow.pop(0)  # 要去除第一列，因為那是表格標題列
	else:
		return rval    # 沒有資料就可以直接回傳了
	
	for row in allrow:
		ncdata = NtuCeibaEvent()

		sinfo = ntuceiba_readcol(row[0])
		ncdata.title = sinfo.data
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[1])
		ncdata.member = sinfo.data
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[2])
		ncdata.method = sinfo.data
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[3])
		ncdata.percent = sinfo.data
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[4])
		ncdata.duedate = ntuceiba_parsedate(sinfo.data)
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[5])
		if sinfo.data == 'Yes' or sinfo.data == u'可以':
			ncdata.late = True
		else:
			ncdata.late = False
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[6])
		ncdata.subdate = sinfo.data
		ncdata.setred(sinfo.red)

		sinfo = ntuceiba_readcol(row[7])
		ncdata.comment = sinfo.data
		ncdata.setred(sinfo.red)

		rval.append(ncdata)

	return rval
