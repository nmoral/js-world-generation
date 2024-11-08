let width = 5000;
let height = 5000;
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
    let perlinValue = perlin(x / width * 100, y / height * 100)
    perlinValue = Math.abs(perlinValue);
    let color = float2color(perlinValue)
    let p = ((y * width) + x) * 4;
    p = p > 0 ? p : 0;

    data[p] = color[0];
    data[p + 1] = color[1];
    data[p + 2] = color[2];
    data[p + 3] = 255;

    return data;
}
