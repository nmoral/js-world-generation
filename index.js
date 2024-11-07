let width = 1000;
let height = 1000;
let ctx;
window.onload = () => {
    let root = document.getElementById('map');
    root.setAttribute('width', width)
    root.setAttribute('height', height);

    ctx = root.getContext('2d');
    ctx.drawImage(new Image(), 0, 0);
    drawMap(root, width, height);

}
let gradient = [];

function drawMap(root, width, height) {
    let x = 0;
    let y = 0;
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    getGradient(width + 1, height + 1);
    while (x < width) {
        while (y < height) {
            data = createMapPoint(data, x, y)
            ++y;
        }
        y = 0;
        ++x;
    }
    imageData.data = data;
    ctx.putImageData(imageData, 0, 0)
}


function createMapPoint(data, x, y) {
    let perlinValue = perlin(x / width * 10, y / height * 10)
    perlinValue = Math.abs(perlinValue);
    let color = float2color(perlinValue)
    let p = (x * (width * 4)) + (y * 4) - 1;

    p = p > 0 ? p : 0;

    data[p] = color[0];
    data[p + 1] = color[1];
    data[p + 2] = color[2];
    return data;
}


function smoothStep(w) {
    if (w <= .0) return 0.0;
    if (w >= 1.0) return 1.0;

    return w * w * (3 - (2 * w));
}

function interpolate(a0, a1, w) {
    return a0 + (a1 - a0) * smoothStep(w);
}

function dotGridGradient(ix, iy, x, y) {
    let dx = x - ix;
    let dy = y - iy;

    return (dx * gradient[iy][ix][0] + dy * gradient[iy][ix][1])
}

function perlin(x, y) {
    let x0 = Math.floor(x);
    let x1 = x0 + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    let sx = x - x0;
    let sy = y - y0;

    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    let ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    let ix1 = interpolate(n0, n1, sx);

    return interpolate(ix0, ix1, sy);
}


function getGradient(x, y) {
    for (let i = 0; i < y; ++i) {
        gradient[i] = [];
        for (let j = 0; j < x; ++j) {
            gradient[i][j] = [Math.random(), Math.random()]
        }
    }
}

function float2color(percentage) {
    let color_part_dec = 255 * percentage;
    let color_part_hex = Number(parseInt(color_part_dec, 10));

    return [color_part_hex, color_part_hex, color_part_hex];
}
