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

"""The python file seperates logic of Rotten Tomato API calls from the
rest of the files in the module
"""

__author__ = 'mosinech@yahoo.com  (George Zhao)'

from config import MOVIES_URL, IMDB_URL, API_KEY
from utils import utils
from time import sleep

import threading
import json
import re
import logging, logging.config

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("tomato_api")

class tomato:
	"""The Rotten Tomato API

	User can use it to access to get all movies in theatre
	and 
	"""
	@staticmethod
	def getMovies(page=1, page_limit=16, country='us'):
		"""
		This function connect through Rotten Tomato API
		to retrive the current movies showing in theatre 
		in the US

		Args:
			page (int, optional): the page number of the whole 
			page_limit (int, optional): the movie limit per page. default: 1 
			country (str, optional): the country of search parameter. default: us

		return:
			list	the list of movies currently in theatre
		"""

		try:
			j = utils.httpConnect(MOVIES_URL % (API_KEY, page, page_limit, country))
			result = json.loads(j)   # throw exception if json load fails
			total = result['total']  # Allow it to throw exception if total is not found in result
			movies= result['movies'] # Allow it to throw exception if movies is not found in result

			# I was planning to use recursive function, but it took too long
			# return the movies if all the pages have been gone through
			# if page*page_limit >= total:
			# 	return movies

			# # Recursively retrieve more pages
			# page += 1
			# return movies + tomato.getMovies(page, page_limit, country)
			return movies, total
		except KeyError as e:
			logger.debug("request error")
			logger.debug(j)
			return {}, 0 # always returns a dict even if there is an error

		except Exception as e:
			logger.debug(utils.errorMessage())
			logger.debug(e)
			logger.debug(j)
			return {}, 0 # always returns a dict even if there is an error

	@staticmethod
	def getImgs(imdb_id):
		"""
		Get all the images on the page of an IMDB movie

		Args:
			imdb_id(int):	the id retrieved from rotten tomato

		Returns:
			list	the list of image tags on imdb page
		"""
		try:
			html = utils.httpConnect(IMDB_URL % imdb_id)
			# always match a image tag with src
			img_regex =  re.compile(r"(<img\s+[^>]*src=\"[^\"]*\"[^>]*>)") 
			return len(img_regex.findall(html))
		except Exception as e:
			logger.debug(utils.errorMessage())
			logger.debug(e)
			logger.debug(html)
			return -1 # always return an negative number if there is an error


class tomatoImgsThread(threading.Thread):
	"""Uses tomato.getImgs to retrieve image count on each IMDB page

	Added Exponential Backoff algorith to handle http request errors

	"""
	def __init__(self, queue, result):
		"""initiate the threading.Thread process

		Args:
			queue(Queue.Queue object):  the queue object that holds all IMDB IDs from parent
			result(list):	The list of data that needs to be returned

		"""
		threading.Thread.__init__(self)
		self.queue =  queue
		self.result=  result

	def run(self):
		"""overwriting default run function from threading.Thread"""
		while True: # Run until queue is done
			try:
				imdb_id = self.queue.get()
				count   = tomato.getImgs(imdb_id)

				# Use a commonly used Exponential Backoff system 
				# if API doesn't return valid result, the sleep timer 
				# gets increased exponentially before making another 
				# request until it extends a limit
				exp = 0
				sleeptime = 0
				# give up after a interval that's larger than 5 min
				while count < 0 and sleeptime < 5*60:
					sleeptime = 0.01 * 2**exp # sleep time gets exponentially increased
					sleep(sleeptime)   # sleep 
					exp += 1
					count   = tomato.getImgs(imdb_id)

				#logger.info("%s has been processed" % imdb_id)
				self.result.append({"url": IMDB_URL % imdb_id,
								 	"count": count,
								 	"imdb_id": imdb_id})
			
			except Exception as e:
				logger.debug(utils.errorMessage())
				logger.debug(e)
			finally:
				self.queue.task_done() # queue finished

class tomatoMoviesThread(threading.Thread):
	"""Uses tomato.getMovies to retrieve all the movies that are currently in theaters

	Added Exponential Backoff algorith to handle http request errors

	"""
	def __init__(self, queue, result):
		"""initiate the threading.Thread process

		Args:
			queue(Queue.Queue object):  the queue object that holds all page ids from parent
			result(list):	The list of IMDB IDs that needs to be returned

		"""
		threading.Thread.__init__(self)
		self.queue =  queue
		self.result=  result

	def run(self):
		"""overwriting default run function from threading.Thread"""
		while True:
			try:
				page_id = self.queue.get()
				movies, total  = tomato.getMovies(page=page_id)

				# Use a commonly used Exponential Backoff system 
				# if API doesn't return valid result, the sleep timer 
				# gets increased exponentially before making another 
				# request until it extends a limit
				exp = 0
				sleeptime = 0
				# give up after a interval that's larger than 5 min
				while len(movies) == 0 and sleeptime < 5*60:
					sleeptime = 0.01 * 2**exp # sleep time gets exponentially increased
					sleep(sleeptime)   # sleep 
					exp += 1
					movies, total  = tomato.getMovies(page=page_id)

				for movie in movies:
					try:
						self.result.append(movie['alternate_ids']['imdb'])
					except KeyError as e:
						logger.info("IMDB ID does not exist") # We expect some movies do not have IMDB ID
			except Exception as e:
				logger.debug(utils.errorMessage())
				logger.debug(e)
			finally:
				self.queue.task_done() # queue finished