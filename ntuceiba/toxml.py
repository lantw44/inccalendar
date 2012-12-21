#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from ntuceiba import NtuCeibaEvent
from datetime import datetime
from lxml import etree

def XMLBuildNtuCaibaEvent(eleobj, cbobj):
	newdata = etree.SubElement(eleobj, 'title')
	newdata.text = cbobj.title
	newdata = etree.SubElement(eleobj, 'member')
	newdata.text = cbobj.member
	newdata = etree.SubElement(eleobj, 'method')
	newdata.text = cbobj.method
	newdata = etree.SubElement(eleobj, 'percent')
	newdata.text = cbobj.percent
	newdata = etree.SubElement(eleobj, 'late')
	newdata.text = str(cbobj.late)
	newdate = etree.SubElement(eleobj, 'comment')
	newdata.text = cbobj.comment
	newdata = etree.SubElement(eleobj, 'red')
	newdata.text = str(cbobj.red)

	if cbobj.duedate == None:
		newdata = etree.SubElement(eleobj, 'dueyear')
		newdata.text = ""
		newdata = etree.SubElement(eleobj, 'duemonth')
		newdata.text = ""
		newdata = etree.SubElement(eleobj, 'duedate')
		newdata.text = ""
		newdata = etree.SubElement(eleobj, 'duehour')
		newdata.text = ""
	else:
		newdata = etree.SubElement(eleobj, 'dueyear')
		newdata.text = str(cbobj.duedate.year)
		newdata = etree.SubElement(eleobj, 'duemonth')
		newdata.text = str(cbobj.duedate.month)
		newdata = etree.SubElement(eleobj, 'duedate')
		newdata.text = str(cbobj.duedate.day)
		newdata = etree.SubElement(eleobj, 'duehour')
		newdata.text = str(cbobj.duedate.hour)

	if cbobj.subdate == None:
		newdata = etree.SubElement(eleobj, 'sub')
		newdata.text = ""
	else:
		newdata = etree.SubElement(eleobj, 'sub')
		newdata.text = cbobj.subdate

	newdata = etree.SubElement(eleobj, 'enabled')
	newdata.text = str(cbobj.enabled)

	if cbobj.key == None:
		newdata = etree.SubElement(eleobj, 'key')
		newdata.text = None
	else:
		newdata = etree.SubElement(eleobj, 'key')
		newdata.text = str(cbobj.key)

def ntuceiba_toxml(listobj):
	xmlroot = etree.Element('ntuceiba')
	for entry in listobj:
		newevt = etree.SubElement(xmlroot, 'ncevent')
		XMLBuildNtuCaibaEvent(newevt, entry)

	return etree.tostring(xmlroot, xml_declaration=True, encoding='UTF-8')
	
