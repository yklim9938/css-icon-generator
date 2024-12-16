const svg2DataURI = (svgCode: string) => {
    let dataURI = svgCode
    const extractedSvg = svgCode.match(/<svg[\S\s]*>/)
    if (extractedSvg?.[0]) {
        dataURI = extractedSvg[0]
    }
    dataURI = dataURI.replace(/<metadata[\s\S]*metadata>/g, "") // remove metadata
    dataURI = dataURI.replace(/<\!--.*?-->/g, "") // remove comments
    dataURI = dataURI.replace(/(\r\n|\n|\r)/gm, " ") // replace line breaks with space
    dataURI = dataURI.replace(/\sversion=".*?"/g, "") // remove version
    dataURI = dataURI.replace(/\title=".*?"/g, "") // remove title
    dataURI = dataURI.replace(/\s{2,}/g, " ") // replace long spaces with single space
    dataURI = dataURI.replace(/#/g, '%23')
    dataURI = dataURI.replace(/</g, '%3C')
    dataURI = dataURI.replace(/>/g, '%3E')
    dataURI = dataURI.replace(/"/g, "'")
    dataURI = "data:image/svg+xml," + dataURI
    return dataURI
}

export default svg2DataURI