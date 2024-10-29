<template>
    <div>
        <div v-if="step == 1" class="min-h-screen p-6 relative">
            <Header>Generate css icons with your svg and png files.</Header>
            <div class="w-full max-w-[600px] mx-auto mt-6">
                <div class="flex gap-2 justify-end mb-2">
                    <div class="tooltip-container flex items-center relative">
                        <div class="tooltip-info inline-block absolute bottom-[100%] right-0 w-[240px] bg-content-light py-1 px-2 rounded-md shadow-sm text-xs">
                            Check this if you don't want your svg to follow text color
                        </div>
                        <i class="icon-info text-primary-light cursor-pointer text-lg"></i>
                    </div>
                    <Checkbox switch reverse v-model="staticSvg"><span class="text-sm">Static Color</span></Checkbox>
                </div>
                <PhotoDrop v-if="step == 1" @input="generateCSS" accept="image/png, image/svg+xml" />
            </div>
            <p class="mt-6 text-xs sm:text-sm font-medium text-center !leading-loose">
                *Make sure to rename your files with <b>small caps and hyphen</b> only
            </p>
            <Footer />
        </div>
        <div v-if="step == 2" class=" mx-auto max-w-[1000px]">
            <div class="flex items-center justify-between mb-6 p-4">
                <button class="text-primary" @click="backToStep1">Back</button>
                <button class="py-2 px-4 bg-primary text-white" @click="showCodeModal = true">Copy Code</button>
            </div>
            <div class="icon-grid grid grid-cols-2 md:grid-cols-4 gap-4" v-html="htmlContent"></div>
        </div>
        <Modal :show="showCodeModal" @close="showCodeModal = false" click-close :max-width="700">
            <div>
                <textarea class="code-area w-full h-[300px] bg-content-light border border-light mt-8 outline-none p-2 text-xs" disabled></textarea>
                <CopyButton v-if="step == 2" :text-to-copy="iconStyle.innerHTML">Copy</CopyButton>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import svg2DataURI from '~/assets/js/svg2data-uri';
const step = ref(1)

const staticSvg = ref(false)
const svgToCSS = (className, svgText) => {
    const dataURI = svg2DataURI(svgText)
    let cssText  = ''
    if (!staticSvg.value) {
        cssText = `i.icon-${className} {
      --svg: url("${dataURI}");
  }`
    }
    else {
        cssText = `i.icon-${className} {
    background-color: unset;
    background-image: url("${dataURI}");
  }`
    }

    return cssText
}

const pngToCss = (className, pngText) => {
    return `i.icon-${className} {
    background-color: unset;
    background-image: url("${pngText}");
  }`
}

const readFile = (file, type) => {
    return new Promise((resolve, reject) => {
        let fileContent = new FileReader();
        fileContent.onload = () => {
            resolve(fileContent.result)
        }
        fileContent.onerror = (err) => {
            reject(err)
        }
        if (type == 'text') {
            fileContent.readAsText(file)
        }
        else {
            fileContent.readAsDataURL(file)
        }
    })
}

let htmlContent = ''
const generateCSS = async (files) => {
    const svgRegex = /.svg$/
    const pngRegex = /.png$/


    let fileError = false

    let cssContent = `i {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-color: currentColor;
      -webkit-mask-image: var(--svg);
      mask-image: var(--svg);
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
  }`

    try {
        for (let i = 0; i < files.length; i++) {
            // convert spaces and underscore into hyphen, and then to lowercase
            let fileName = files[i].name
            fileName = fileName.replace(/[\s_]/g, '-').toLowerCase()

            let iconName = fileName.replace(/\.[^/.]+$/g, '')
            let iconClass = ''
            if (svgRegex.test(fileName)) { // generate svg css
                let svgContent = await readFile(files[i], 'text')
                iconClass = svgToCSS(iconName, svgContent)
            }
            else if (pngRegex.test(fileName)) { // generate png css
                let pngContent = await readFile(files[i], 'base64')
                iconClass = pngToCss(iconName, pngContent)
            }
            else {
                console.log('err ' + fileName)
                fileError = true
                break;
            }

            if (iconClass) {
                cssContent += `\n\n${iconClass}`
                htmlContent += `<div class="icon-entry" data-icon="${iconName}"><i class="icon-${iconName}" data-icon="${iconName}"></i><span data-icon="${iconName}">icon-${iconName}</span></div>`
            }
        }
    }
    catch (err) {
        fileError = true
        console.error(err)
    }
    finally {
        if (fileError) {
            alert('File naming error')
            return
        }
    }
    previewCSS(cssContent)
    return
}

let iconStyle = null

const previewCSS = (cssContent) => {
    if (iconStyle) {
        iconStyle.remove()
    }
    iconStyle = document.createElement('style')
    iconStyle.innerHTML = cssContent
    document.head.appendChild(iconStyle)

    step.value = 2
    let codeTextArea = document.querySelector('.code-area')
    if (codeTextArea) {
        codeTextArea.value = cssContent
    }
}

const backToStep1 = () => {
    if (iconStyle) {
        iconStyle.remove()
    }
    iconStyle = null
    htmlContent = ''
    step.value = 1
}

onBeforeUnmount(() => {
    if (iconStyle) {
        iconStyle.remove()
    }
    iconStyle = null
    htmlContent = ''
})

const showCodeModal = ref(false)
</script>

<style scoped>
.icon-grid :deep(.icon-entry) {
    display: flex;
    gap: 12px;
    cursor: pointer;
}

.icon-grid :deep(.icon-entry i) {
    font-size: 20px;
    flex-shrink: 0;
}

.icon-grid :deep(.icon-entry span) {
    font-size: 14px;
}

.code-area {
    resize: none;
}

.tooltip-info {
    visibility: hidden;
    opacity: 0;
    transition: all 0.15s;
    pointer-events: none
}

.tooltip-container:hover .tooltip-info {
    visibility: visible;
    opacity: 1;
}
</style>