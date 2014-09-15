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

"""This is where the function calls happen in the module"""

__author__ = 'mosinech@yahoo.com (George Zhao)'

from config import IMDB_URL, PROXIES
from utils import utils
from RottenTomatoAPI import tomato, tomatoImgsThread, tomatoMoviesThread
import time
import json
import Queue
import math
import logging

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("img_count")

class ImgCount:
	"""This is the main function that starts threads and initiate the image coute process"""
	
	def getImgs(self, imdb_ids=[]):
		"""
		Uses multithreads to perform http request that gets imdb pages
		In addition, count the image number per page

		Args:
			imdb_ids(list, optional): a list of IMDB ids that needs to be processed

		Returns:
			list, the imdb image list 
		"""

		start = time.time() # Keep track of the time
		img_list = []
		queue = Queue.Queue()
		# Spin X number of threads
		for i in range(50):
			q = tomatoImgsThread(queue, img_list)
			q.setDaemon(True)
			q.start()

		# Put imdb ids in the queue, which is ready to be processed by the threads
		for imdb_id in imdb_ids:
			queue.put(imdb_id)

		queue.join()

		logger.info("Retrieving all the IMDB IDs took: %s " % str(time.time()-start)) # print time taken
		return img_list

	def getMovies(self):
		"""Uses multithreads to look up imdb movie page based on 

		Returns:
			imdb_ids(list): 
		"""
		start = time.time() # Keep track of time
		imdb_ids = []
		queue = Queue.Queue()

		movies, total = tomato.getMovies()
		logger.info("The total number of movie is: %s" % total)
		for movie in movies:
			try:
				imdb_ids.append( movie['alternate_ids']['imdb'])
			except KeyError as e:
				logger.info("IMDB ID does not exist") # we expects some movies do not have IMDB ID

		for i in range(50):
			q = tomatoMoviesThread(queue, imdb_ids)
			q.setDaemon(True)
			q.start()

		# Calculate the total page number and put them in queue
		page_range = int(math.ceil(float(total) / len(movies)))
		for i in range(2, page_range+1):
			queue.put(i)

		queue.join()
		logger.info("Get Movie took: %s " % str(time.time()-start))
		return imdb_ids

	def process(self):
		"""This is the main function that performs image number count"""
		start = time.time()
		
		# This is used with recursive get movies function
		# movies = tomato.getMovies()
		# for movie in movies:
		# 	try:
		# 		title   = movie['title']
		# 		imdb_id = movie['alternate_ids']['imdb']
		# 		imdb_ids.append(imdb_id)
		# 	except Exception as e:
		# 		print e
		# 		print utils.errorMessage()
		# 		#print movie
		# print imdb_ids

		imdb_ids = self.getMovies() # Get IMDB IDs

		img_list = self.getImgs(imdb_ids) # Get the Image Count for all Movies

		# Print in a readable Json format
		# sort_key needs to be false to match the documented format
		print json.dumps(img_list, sort_keys=False, indent=2, separators=(',', ': '))
		logger.info(len(img_list))
		end = time.time()
		logger.debug("The total took to execute the script is: %s " % str(end-start))

if __name__ == "__main__":
	client = ImgCount()

	client.process()
	#print utils.httpConnect("http://www.imdb.com/title/tt2870708/")
