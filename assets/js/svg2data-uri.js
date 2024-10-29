const svg2DataURI = (svgCode) => {
    let dataURI = svgCode.replace(/<\!--.*?-->/g, "") // remove comments
    dataURI = dataURI.replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
    dataURI = dataURI.replace(/\sversion=".*?"/g, "") // remove version
    dataURI = dataURI.replace(/\s{2,}/g, " ") // replace long spaces with single space
    // dataURI = dataURI.replace(/\swidth=".*?"/g, "") // remove width
    // dataURI = dataURI.replace(/\sheight=".*?"/g, "") // remove height
    /*   if (!staticSvg.value) {
        dataURI = dataURI.replace(/fill=".*?"/g, 'fill="currentColor"') // change fill to currentColor
        dataURI = dataURI.replace(/stroke=".*?"/g, 'stroke="currentColor"') // change fill to currentColor
      } */
    dataURI = dataURI.replace(/#/g, '%23')
    dataURI = dataURI.replace(/</g, '%3C')
    dataURI = dataURI.replace(/>/g, '%3E')
    dataURI = dataURI.replace(/"/g, "'")
    dataURI = "data:image/svg+xml," + dataURI
    return dataURI
} 

export default svg2DataURI