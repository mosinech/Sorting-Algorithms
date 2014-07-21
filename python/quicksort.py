from random import randint

class QuickSort:
	"""
	Space-oriented sorting method. In a embedded system, quicksort 
	is the  better solution than mergesort because it only uses the 
	the space within the list. Elements get swapped within the list
	once they have been compared. The only drawback is that the worst
	case Big-O is n^2

	"""	
	@staticmethod
	def sort(list):
		"""
		quick sort the list

		Args:
			list,	list,	the list that needs to be Space-oriented

		Returns:
			list, the sorted list
		"""
		QuickSort.list = list
		QuickSort.quick(0, len(list)-1)
		return QuickSort.list

	@staticmethod
	def quick(i, k):
		"""

		"""
		if i < k:
			p = QuickSort.partition(i, k)
			QuickSort.quick(i, p -1)
			QuickSort.quick(p+1, k)


	@staticmethod
	def partition(left, right):
		pivot = (left+right) /2 #pick mid point as pivot
		pivot_value = QuickSort.list[pivot]
		QuickSort.list[pivot], QuickSort.list[right] = QuickSort.list[right], QuickSort.list[pivot]
		stored_index = left
		for ii in range (left, right):
			if QuickSort.list[ii] <= pivot_value:
				QuickSort.list[stored_index], QuickSort.list[ii] = QuickSort.list[ii], QuickSort.list[stored_index]
				stored_index = stored_index + 1
		QuickSort.list[stored_index], QuickSort.list[right] = QuickSort.list[right], QuickSort.list[stored_index]
		print QuickSort.list
		return stored_index

if __name__ == '__main__':
	l = [randint(0,1000) for x in range(0,9)]
	print l
	print QuickSort.sort(l)