# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

"""The python file seperates logic of http calls from the
rest of the files in the module
"""

__author__ = 'mosinech@yahoo.com  (George Zhao)'

from config import PROXIES
import sys, os
import urllib2
import logging, logging.config
from random import randint

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("utils")

class utils:
	"""The utility function that supports other classes"""
	@staticmethod
	def httpConnect(url):
		"""The universal http call connector. It returns the results from the http request

		Args:
			url(str):	the url to visit

		Returns:
			str, the result from the http request
		"""
		try:
			protocol = "https" if url[:5] == "https" else "http" # determine if url uses ssl
			proxy = utils.getProxy(PROXIES, protocol) # Get the proxy from proxy list
				
			# build request opener for a proxy
			if (proxy):
				logger.info("Using Proxy: %s" % proxy)
				auth  = urllib2.HTTPBasicAuthHandler()
				opener= urllib2.build_opener(proxy, auth, urllib2.HTTPHandler)
				urllib2.install_opener(opener)
			
			# Build request
			req = urllib2.Request(url)
			# req.add_header('X_REQUESTED_WITH', 'XMLHttpRequest')
			# req.add_header('ACCEPT', 'application/json, text/javascript, */*; q=0.01')
			
			# Depends on your internet connection, timeout may needs to be changed
			resp = urllib2.urlopen(req, timeout=5) 
			return resp.read()
		except Exception as e:
			logger.debug(utils.errorMessage())
			logger.debug(url)
			return e # returns error message

	@staticmethod
	def getProxy(proxies, protocol):
		"""Randomly select a proxy in a list of proxy

		Args:
			proxies(list): the list of proxy that user can choose from
			protocol(string): http or https

		Returns:
			string, one random proxy amongst the list of proxies given

		"""
		available_proxies = []
		for proxy in proxies:
			proxy_protocol = "https" if proxy[:5] == "https" else "http" # determine if url uses ssl
			if proxy_protocol == protocol:
				available_proxies.append(proxy)

		if len(available_proxies) > 0:
			return available_proxies[randint(0, len(available_proxies)-1)]
		return

	@staticmethod
	def errorMessage():
		"""Get Error Message from sys

		This function is used to give more useful error message including
		the initial error lineno, the error type, the error file path and
		the filename

		Return:
			dict, error type, error filename, and lineno in a dict
		"""
		try:
			ext_type, exc_obj, exc_tb = sys.exc_info()
			fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)
			return {'error type': ext_type, 
					'file name' : fname, 
					'line no.'  : exc_tb.tb_lineno}
		except Exception as e:
			logger.debug(e)
			return {}
			