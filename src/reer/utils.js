import {allVector3Points} from "./init.js";
import {divisionCount_result} from "./constants.js";

export function countTotalLineNumber() {
    let curveCount = allVector3Points.length;
    let lineCountEachCurve = allVector3Points[0].length;
    let total = curveCount * lineCountEachCurve;
    return total;
}

export function instanceIndexToPointArrayIndex(idx) {
    let i = Math.floor(idx / divisionCount_result);
    let j = idx % divisionCount_result;
    return {i, j};
}