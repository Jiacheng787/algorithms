package com.company;

import java.util.Arrays;

public class BinaryHeap {
    private int[] data;
    private int size;
    public BinaryHeap(int[] arr) {
        this.data = arr;
        this.size = arr.length;
    }
    public void maxHeapify(int i) {
        int max = i;

        if (i >= this.size) return;

        int left = i * 2 + 1;
        int right = i * 2 + 2;

        if ((left < this.size) && (this.data[left] > this.data[max])) {
            max = left;
        }

        if ((right < this.size) && (this.data[right] > this.data[max])) {
            max = right;
        }

        if (max == i) return;

        this.swap(this.data, i, max);

        this.maxHeapify(max);
    }
    public void rebuildHeap() {
        int L = this.size / 2; // int类型自动向下取整
        for(int i = L - 1; i >= 0; i--){
            this.maxHeapify(i);
        }
    }
    public void sort() {
        for(int i = this.size - 1; i > 0; i--){
            this.swap(this.data, 0, i);
            this.size--; // 将交换后的元素分离出堆
            this.maxHeapify(0);
        }
        this.size = this.data.length;
    }
    public int[] getHeap() {
        return this.data;
    }
    public void swap(int[] A, int i, int j) {
        int t = A[i];
        A[i] = A[j];
        A[j] = t;
    }
    public static void main(String[] args) {
        int[] arr = {15, 2, 8, 12, 5, 2, 3, 4, 7};
        BinaryHeap binaryHeap = new BinaryHeap(arr);
        binaryHeap.rebuildHeap();
        binaryHeap.sort();
        int[] res = binaryHeap.getHeap();
        System.out.println(Arrays.toString(res));
    }
}
