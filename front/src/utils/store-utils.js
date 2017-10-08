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

export const createAllTimeSeriesFromTiff = (legendCanvas, allTiffList) => {
  // create time series data from each time step data
  const allTimeSeriesInverse = allTiffList.map((tiffCanvas) => {
    return createTimeSeriesInverse(tiffCanvas, legendCanvas);
  });

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

export const arraySum = (arr) => {
  return arr.reduce((prev, current) => {
    return prev + current;
  });
};
