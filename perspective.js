const utils = new Utils('errorMessage');
const imageUsed = document.getElementById('sample').getAttribute('src')
console.log(imageUsed)
const applyButton = document.getElementById('apply')
const setUpApplyButton = function () { 
    //console.log(cv)
    
    let pointsArray = []
    const children = document.querySelectorAll('#window_g .handle')
    console.log(children)
    children.forEach(e =>{
        const pos = e.getAttribute('transform');
        console.dir(pos)
        const point = pos.replace('translate(','').replace(')','').split(',')
        pointsArray.push(point[0])
        pointsArray.push(point[1])
    })
    console.log(pointsArray)
    utils.loadImageToCanvas(imageUsed, 'imageInit')
    setTimeout(()=>{
    let src = cv.imread('imageInit');
    const imageHeight = document.getElementById('imageInit').height
    const imageWidth = document.getElementById('imageInit').width
    const svgCropHeight =  document.querySelector('#background svg').getAttribute('height') - 80
    const svgCropWidth =  document.querySelector('#background svg').getAttribute('width') - 80
    console.log('h : ',svgCropHeight,' w : ',svgCropWidth)
    const scaleFactor = parseInt(imageWidth / svgCropWidth)
    debugger
    pointsArray = pointsArray.map( e => {
        const num = parseInt((parseInt(e) + 40)/scaleFactor)
        return num
    })
    let dst = new cv.Mat();
    let newsize = NewSize(pointsArray);
    let dsize = new cv.Size(newsize[0], newsize[1]);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pointsArray);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, newsize[0], 0, newsize[0], newsize[1], 0, newsize[1]]);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    document.getElementById('imageInit').style.display = "none"
    cv.imshow('imageResult', dst);
    src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
    },500)
    
        
}
applyButton.setAttribute('disabled','true')
applyButton.onclick = setUpApplyButton
utils.loadOpenCv(() => {
    setTimeout(function () { 
        applyButton.removeAttribute('disabled');
    },500)
});


function NewSize(arr){
    console.log(arr);
    let first = Math.sqrt(Math.pow(arr[2] - arr[0], 2) + Math.pow(arr[3] - arr[1], 2))
    let second = Math.sqrt(Math.pow(arr[4] - arr[6], 2) + Math.pow(arr[5] - arr[7], 2))
    let wid = Math.max(first, second)
    let third = Math.sqrt(Math.pow(arr[2] - arr[4], 2) + Math.pow(arr[3] - arr[5], 2))
    let fourth = Math.sqrt(Math.pow(arr[0] - arr[6], 2) + Math.pow(arr[1] - arr[7], 2))
    let heig = Math.max(third, fourth)
    console.log(wid, heig);
    return [wid | 0, heig | 0]  // converts to integer
}
