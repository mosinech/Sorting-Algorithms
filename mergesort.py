from random import randint

class MergeSort:
	@staticmethod
	def sort(list):
		"""
		sort the list from the least to largest

		Args:
			list, 	list, the list that needs to be sorted

		Returns:
			list, the sorted list
		"""
		if len(list) <= 1:
			return list

		# Break the list into 1 element list
		left = MergeSort.sort(list[len(list)/2:])
		right= MergeSort.sort(list[:len(list)/2])
		return MergeSort.merge(left, right)

	@staticmethod
	def merge(left, right):
		"""
		merge the left and the right list and sort them in ascending order

		Args:
			left,	list,	a sorted list
			right, 	list, 	a sorted list

		Returns:
			list,	a sorted list from merge
		"""
		results = []

		# iterate through the list until one list is empty
		while len(left) > 0 or len(right) > 0:
			# if neither left and right list is empty
			if len(left) > 0 and len(right) > 0:
				# Compare the left most element in each list
				# Append the less value to the sorted list 
				# Remove the less value in left or right list
				if left[0] < right[0]:
					results.append(left[0])
					left.pop(0)
				else:
					results.append(right[0])
					right.pop(0)
			# if left list is empty, add the right list to the 
			# end of the sorted list because right list is already
			# sorted, and every element in the sorted list is less
			# than the element in the right list.
			elif len(left) == 0:
				results = results + right
				right = []
			# If right list is empty, add the left list to the
			# end of the sorted list because left list is already
			# sorted. 
			elif len(right) == 0:
				results = results + left
				left = []
		return results

if __name__ == '__main__':
	l = [randint(0,1000) for x in range(0,9)]
	print MergeSort.sort(l)