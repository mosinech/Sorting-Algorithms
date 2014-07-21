import math
from random import randint

class Heapsort:

	@staticmethod
	def heapsort(list, count):
		"""
		Build the list into a binary tree with the largest value
		as the root. All parent nodes need to be greater the child
		nodes.
		
		Args:
			list, list, the list that needs to be sorted
			count, int, the length of the list

		Return:
			list, the sorted list
		"""
		# Build a heap first
		list = Heapsort.heapify(list, count)

		# start from the second to last element in the heap
		# because the last element is already the largest vlaue
		end = count - 1
		while end > 0:
			# Move the root to the last element
			list[end], list[0] = list[0], list[end]
			end -= 1
			list = Heapsort.sift_down(list, 0, end)
		return list

	@staticmethod
	def heapify(list, count):
		"""
		Building a heap in a list/array

		Args:
			list,	the list that needs to be heapified
			count,	the end of the list

		Returns:
			list, a heapified list

		Notes:
			iParent     = floor((i-1) / 2)
			iLeftChild  = 2*i + 1
			iRightChild = 2*i + 2
		"""
		# start point has to be second to the last row
		start = int(math.floor((count - 2) / 2))
		

		# Keep on sift down til the root
		while start >= 0:
			# the end of the list also shrinks by 1 because
			# it doesn't need to be checked again
			list = Heapsort.sift_down(list, start, count-1)
			start -= 1
		return list


	@staticmethod 
	def sift_down(list, start, end):
		"""
		The fundamentals of heap sort. This function is used
		to 

		Args:
			list,	list,	the list that needs to be heapified
			start,	int,	the starting point of the list
			end,	int,	the ending point of the list
		Return:
			list,	the heapified list
		"""
		root = start # set the starting point as the root

		# loop while root's child is a valid node within the list
		while root * 2 +1 <= end:
			child = root * 2 + 1 #child node of root
			swap  = root

			# If left child is greater than parent, assign swap to left child
			if list[swap] < list[child]:
				swap = child

			# If right child is greater than parent, assign swap to right child
			if child + 1 <= end and list[swap] < list[child+1]:
				swap = child + 1

			# if none of the children are greater than parent
			# the list is heapified, or else swap the parent and
			# child node.
			if swap != root:
				list[swap], list[root] = list[root], list[swap]
				root = swap
			else:
				return list

		return list # return the heap list


if __name__ == "__main__":
	l = [randint(0,1000) for x in range(0,10)]
	print Heapsort.heapsort(l, len(l))



