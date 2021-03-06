class Heap {
	constructor(arr) {
		this.data = [...arr]; // 二叉堆实际上就是数组
		this.size = this.data.length;
	}
	/**
	 * @description 父子节点交换
	 * 当前节点与两个子节点进行对比，如果不符合二叉堆性质，取三个里面的最大值并进行交换
	 * 交换后的子节点继续递归进行后续子树的交换
	 * 关键代码：
	 * const left = i * 2 + 1; // 获取左节点
	 * const right = i * 2 + 2; // 获取右节点
	 */
	maxHeapify = (i) => {
		let max = i; // 保存最大的节点下标

		if (i >= this.size) return;

		const left = i * 2 + 1; // 左节点下标
		const right = i * 2 + 2; // 右节点下标

		if ((left < this.size) && (this.data[left] > this.data[max])) {
			max = left;
		}

		if ((right < this.size) && (this.data[right] > this.data[max])) {
			max = right;
		}

		if (max === i) return; // 如果最大节点是其本身，不进行交换

		[this.data[i], this.data[max]] = [this.data[max], this.data[i]];

		return this.maxHeapify(max);
	}
	/**
	 * @description 形成最大堆
	 * 上面的maxHeapify函数只能对某一结点进行对调，无法对整个数组进行重构
	 * 所以需要获取到所有的分支节点（不含叶子节点），然后对每个分支节点依次进行递归重构
	 * 注意这个时候数组还不是有序的，因为兄弟节点之间还没有排序
	 * 关键代码：
	 * const L = Math.floor(this.size / 2); // 获取分支节点
	 */
	rebuildHeap = () => {
		// 获取分支节点
		const L = Math.floor(this.size / 2);
		for(let i = L - 1; i >= 0; i--){
			// 每个i都代表一个分支节点的下标
			this.maxHeapify(i);
		}
	}
	/**
	 * @description 生成升序数组
	 * 从最后一个元素开始，和堆顶元素交换，然后size-1将最后一个元素分离出堆，调用maxHeapify维持最大堆性质
	 * 由于堆顶元素必然是堆中最大的元素，所以一次操作之后，堆中存在的最大元素被分离出堆，重复n-1次之后，数组排列完毕
	 * 需要先调用rebuildHeap改造成最大堆，然后进行排序，最终会变成一个升序数组
	 * 如果是从小到大排序，用最大堆；从大到小排序，用最小堆
	 */
	sort = () => {
		for(let i = this.size - 1; i > 0; i--){
			[this.data[0], this.data[i]] = [this.data[i], this.data[0]];
			this.size--; // 将交换后的元素分离出堆
			this.maxHeapify(0);
		}
		this.size = this.data.length; // 排序完成后重新获取size
	}
}

const heap = new Heap([15, 2, 8, 12, 5, 2, 3, 4, 7]);

heap.rebuildHeap();

heap.sort();

console.log(heap.data)