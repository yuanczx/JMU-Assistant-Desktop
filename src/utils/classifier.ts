function getGap(ind: number[]): number[] {
    let gap: number[] = [0]
    for (let i = 1; i < ind.length; i++) {
        gap.push(ind[i] - ind[i - 1])
    }
    return gap
}

function getIndexes(gap: number[]): number[] {
    let indexes: number[] = [0]
    let i = 1;
    gap.push(0)
    while (i < gap.length - 1) {
        if (gap[i] != gap[i - 1]) {
            if (gap[i] != gap[i + 1]) {
                indexes.push(i)
                i++
            } else if (i >= 2 && gap[i] == gap[i + 1] && gap[i - 1] == gap[i - 2]) {
                indexes.push(i)
                i++
            }
        }
        i++
    }
    return indexes
}

export {
    getGap,
    getIndexes
}