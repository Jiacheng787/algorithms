package com.company;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class DiagonalTraverseArray {
    /**
     * 实现一个函数，沿对角线遍历二维数组
     * 例如：
     * [
     *   [1, 2, 3],
     *   [4, 5, 6],
     *   [7, 8, 9]
     * ]
     * 打印输出：
     * [3, 2, 6, 1, 5, 9, 4, 8, 7]
     */
    private int[][] arr;

    public List<Integer> flatArray(int[][] matrix) {
        this.arr = matrix;
        final int n = arr.length - 1;
        final int m = arr[0].length - 1;
        List<Integer> res = new ArrayList<>();

        for (int i=m; i>=0; i--) {
            List<Integer> list = diagonalTraverse(0, i, n, m);
            res.addAll(list);
        }

        for (int i=1; i<=n; i++) {
            List<Integer> list = diagonalTraverse(i, 0, n, m);
            res.addAll(list);
        }

        return res;
    }

    public List<Integer> diagonalTraverse(int x, int y, int n, int m) {
        List<Integer> list = new ArrayList<>();
        while (x <= n && y <= m) {
            list.add(arr[x][y]);
            x++;
            y++;
        }
        return list;
    }

    @Test
    public void test() {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        List<Integer> res = flatArray(arr);
        System.out.println(res);
    }
}
