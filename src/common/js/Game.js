
function createImg(src) {
  const img = new Image()
  img.src = src
  return img
}

function intersect(rect1, rect2) {
  const half1Width = rect1.width / 2
  const half1Height = rect1.height / 2
  const half2Width = rect2.width / 2
  const half2Height = rect2.height / 2

  const cen1 = {
      x: rect1.x + half1Width,
      y: rect1.y + half1Height
    }
  const  cen2 = {
      x: rect2.x + half2Width,
      y: rect2.y + half2Height
    }

    return Math.abs(cen2.x - cen1.x) <= half1Width + half2Width && Math.abs(cen2.y - cen1.y) <= half1Height + half2Height
}

export {
  createImg,
  intersect
}
