<template>
  <div>
    <div v-if="step == 1" class="min-h-screen p-6 relative">
        <h1 class="text-center pt-6 text-3xl sm:text-4xl font-bold text-primary">CSS Icons Generator</h1>
        <h2 class="text-center pt-4 font-medium text-sm sm:text-base">Generate css icons with your svg and png files.</h2>
        <div class="w-full max-w-[600px] mx-auto mt-8">
          <div class="flex gap-2 justify-end mb-2">
            <div class="tooltip-container relative">
              <div class="tooltip-info inline-block absolute bottom-[100%] right-0 w-[240px] bg-content-light py-1 px-2 rounded-md shadow-sm text-xs">Check this if your svg has fixed colors</div>
              <svg class="mt-[1px] text-primary-light cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
            </div>
            <Checkbox switch reverse v-model="staticSvg"><span class="text-sm">Static SVG</span></Checkbox>
          </div>
          <PhotoDrop v-if="step == 1" @input="generateCSS" accept="image/png, image/svg+xml"/>
        </div>
        <p class="mt-6 text-xs sm:text-sm font-medium text-center !leading-loose">*Make sure to rename your files with <b>small caps and hyphen</b> only</p>
        <div class="made-by z-[3]">Made by <a href="https://github.com/yklim9938" class="underline text-primary" target="_blank">YK Lim</a></div>
    </div>
    <div v-if="step == 2" class=" mx-auto max-w-[1000px]">
      <div class="flex items-center justify-between mb-6 p-4">
        <button class="text-primary" @click="backToStep1">Back</button>
        <button class="py-2 px-4 bg-primary text-white" @click="showCodeModal=true">Copy Code</button>
      </div>
      <div class="icon-grid grid grid-cols-2 md:grid-cols-4 gap-4" v-html="htmlContent"></div>
    </div>
    <Modal :show="showCodeModal" @close="showCodeModal=false" click-close :max-width="700">
      <div>
        <textarea class="code-area w-full h-[300px] bg-content-light border border-light mt-8 outline-none p-2 text-xs" disabled></textarea>
        <button class="bg-primary py-2 px-4 w-full text-white mt-6" @click="copyCode">{{copying ? 'Copied!' : 'Copy'}}</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'CSS Icons Generator - Combine svg and png files into single css file.',
  ogTitle: 'CSS Icons Generator - Combine svg and png files into single css file.',
  description: 'Generate css icons with your svg and png files.',
  ogDescription: 'Generate css icons with your svg and png files.',
  ogImage: '/card.png',
  twitterCard: 'summary_large_image',
})

const step = ref(1)

const staticSvg = ref(false)
const svgToCSS = (className, svgText) => {
  let cssText = svgText.replace(/<\!--.*?-->/g, "") // remove comments
  cssText = cssText.replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
  cssText = cssText.replace(/version=".*?"/g, "") // remove version
  cssText = cssText.replace(/width=".*?"/g, "") // remove width
  cssText = cssText.replace(/height=".*?"/g, "") // remove height
  if (!staticSvg.value) {
    cssText = cssText.replace(/fill=".*?"/g, 'fill="currentColor"') // change fill to currentColor
    cssText = cssText.replace(/stroke=".*?"/g, 'fill="currentColor"') // change fill to currentColor
  }
  cssText = cssText.replace(/#/g, '%23')
  cssText = cssText.replace(/</g, '%3C')
  cssText = cssText.replace(/>/g, '%3E')
  cssText = cssText.replace(/"/g, "'")
  if (!staticSvg.value) {
    cssText = `i.icon-${className} {
    --svg: url("data:image/svg+xml,${cssText}");
}`
  }
  else {
    cssText = `i.icon-${className} {
  background-color: unset;
  background-image: url("data:image/svg+xml,${cssText}");
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
  catch(err) {
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

const copying = ref(false)
const copyCode = async () => {
  if (!iconStyle || copying.value) {
    return
  }
  try {
    await navigator.clipboard.writeText(iconStyle.innerHTML)
    copying.value = true
    setTimeout(() => {
        copying.value = false
    }, 1000)
  }
  catch(err) {
    console.log(err)
  }
}
</script>

<style scoped>
.made-by {
	position: absolute;
	bottom: 16px;
	font-size: 14px;
	left: 50%;
	transform: translateX(-50%);
  display: none;
}

@media screen and (min-height: 614px) {
  .made-by {
    display: block
  }
}

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