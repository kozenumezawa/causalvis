function getRGBAFromTiff(canvas) {
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rgba = image.data; // rgba = [R, G, B, A, R, G, B, A, ...] (hex data)
  return rgba;
}

function createTimeSeriesInverse(tiffCanvas, legendCanvas) {
  const timeSeriesInverse = [];
  const tiffRGBA = getRGBAFromTiff(tiffCanvas);
  if (legendCanvas !== null) {
    const legendRGBA = getRGBAFromTiff(legendCanvas);
    const colorMap = legendRGBA.slice(0, legendRGBA.length / legendCanvas.height);

    // get scalar from data
    for (let i = 0; i < tiffRGBA.length / 4; i += 1) {
      let scalar = 0;
      const r = tiffRGBA[(i * 4) + 0];
      const g = tiffRGBA[(i * 4) + 1];
      const b = tiffRGBA[(i * 4) + 2];
      const a = tiffRGBA[(i * 4) + 3];
      for (let j = 0; j < colorMap.length / 4; j += 1) {
        if (r === colorMap[(j * 4) + 0]
          && g === colorMap[(j * 4) + 1]
          && b === colorMap[(j * 4) + 2]
          && a === colorMap[(j * 4) + 3]) {
          scalar = j;
          break;
        }
      }
      timeSeriesInverse.push(scalar);
    }
  } else {
    // get scalar from data
    for (let i = 0; i < tiffRGBA.length / 4; i += 1) {
      let scalar = 0;
      const r = tiffRGBA[(i * 4) + 0];
      scalar = r;
      timeSeriesInverse.push(scalar);
    }
  }

  return timeSeriesInverse;
}

function transposeTimeSeries(allTimeSeriesInverse) {
  const timeSeries = [];
  for (let i = 0; i < allTimeSeriesInverse[0].length; i += 1) {
    timeSeries[i] = [];
    for (let j = 0; j < allTimeSeriesInverse.length; j += 1) {
      timeSeries[i][j] = allTimeSeriesInverse[j][i];
    }
  }
  return timeSeries;
}

function getArrayAverage(arr) {
  const sum = arr.reduce((prev, current) => prev + current);
  return sum / arr.length;
}

export const createAllTimeSeriesFromTiff = (legendCanvas, allTiffList) => {
  // create time series data from each time step data
  const allTimeSeriesInverse = allTiffList.map(tiffCanvas => createTimeSeriesInverse(tiffCanvas, legendCanvas));

  return transposeTimeSeries(allTimeSeriesInverse);
};

export const toTwoDimensions = (allTimeSeries, canvasWidth, canvasHeight) => {
  const twoDimensions = [];
  for (let y = 0; y < canvasHeight; y += 1) {
    twoDimensions[y] = [];
    const yIdx = y * canvasWidth;
    for (let x = 0; x < canvasWidth; x += 1) {
      twoDimensions[y].push(allTimeSeries[x + yIdx]);
    }
  }
  return twoDimensions;
};


export const isSamplingPoint = (idx, width, meanR) => {
  if (meanR === 0) {
    return true;
  }
  const x = idx % width;
  const y = Math.floor(idx / width);
  if (x % ((meanR * 2) + 1) === meanR && y % ((meanR * 2) + 1) === meanR) {
    return true;
  }
  return false;
};

export const arraySum = arr => arr.reduce((prev, current) => prev + current);

export const applyMeanFilter = (allTimeSeries, width, windowSize) => {
  const meanR = (windowSize - 1) / 2;
  const lenAllArea = allTimeSeries.length;

  const newTimeSeries = allTimeSeries.map((timeSeries, centerIdx) => {
    const yCenter = Math.floor(centerIdx / width);

    // apply mean filter to data of one point through all time
    const meanTimeSeries = timeSeries.map((scalar, timeIdx) => {
      if (scalar === 0) {
        return 0;
      }
      const valueList = [];
      for (let y = -meanR; y <= meanR; y += 1) {
        for (let x = -meanR; x <= meanR; x += 1) {
          const targetIdx = centerIdx + x + (y * width);
          if (targetIdx >= 0 && targetIdx < lenAllArea) {
            const yTarget = Math.floor(targetIdx / width);
            const yDiff = yTarget - yCenter;
            // yDiff is used to handle calculation of edge correctly
            if (yDiff === y) {
              // remove the value within 0
              if (allTimeSeries[targetIdx][timeIdx] > 0) {
                valueList.push(allTimeSeries[targetIdx][timeIdx]);
              }
            }
          }
        }
      }
      if (valueList.length === 0) {
        return 0;
      }
      return getArrayAverage(valueList);
    });
    return meanTimeSeries;
  });
  return newTimeSeries;
};
