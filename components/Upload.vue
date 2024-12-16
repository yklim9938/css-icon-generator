<template>
    <div>
        <h2 class="text-center text-lg font-semibold">Generate css icons with your svg and png files.</h2>
        <div class="mt-4">
            <PhotoDrop  @input="generateCSS" />
            <p class="mt-3 text-xs sm:text-sm font-medium text-center !leading-loose"> *Make sure to rename your files with <b>small caps and hyphen</b> only    </p>
        </div>
        <div class="my-6 prose mx-auto">
            <h3 class="text-center text-primary font-bold text-2xl mb-2">How to Use</h3>
            <ol>
                <li>Drop your svg or png files to generate css code.</li>
                <li>Copy and paste the code into your project.</li>
                <li>Start using your icons with <code>&lt;i class="icon-name"&gt;&lt;/i&gt;</code>.</li>
                <li>By default, the icons will follow your font color. To use icon's original color, just add <code>color</code> class. Eg.<code>&lt;i class="icon-name color"&gt;&lt;/i&gt;</code>.</li>
            </ol>
        </div>
        <div v-if="preview" class="previewer p-6 mt-[50px]" :class="{show: preview}">
            <div class="mx-auto max-w-[800px]">
                <div class="flex items-center justify-between mb-4">
                    <button class="flex items-center gap-2 py-2 pr-2 hover:text-secondary" @click="backToStep1">
                        <i class="icon-back text-lg"></i>
                        <span class="leading-none">Back</span>
                    </button>
                </div>
                <div class="mb-5 text-sm">*Click the icons to toggle <code class="text-secondary">color</code> class.</div>
                <div class="icon-grid grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4" v-html="htmlContent"></div>
                <div class="mt-7">
                    <button class="btn btn-primary w-full" onclick="codeModal.showModal()"><i class="icon-code text-lg"></i> Code</button>
                </div>
            </div>

            <dialog id="codeModal" class="modal">
                <div class="modal-box max-w-[700px]">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-lg">✕</button>
                    </form>
                    <div class="mt-6">
                        <textarea class="code-area w-full h-[300px] resize-none textarea !textarea-primary textarea-xs" disabled></textarea>
                        <CopyButton class="btn btn-primary w-full mt-5 uppercase" :text-to-copy="iconStyle?.innerHTML">Copy </CopyButton>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button></button>
                </form>
            </dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import svg2DataURI from '~/assets/js/svg2data-uri';

const readFile = (file: File, type: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let fileContent = new FileReader();
        fileContent.onload = () => {
            resolve(fileContent.result as string)
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

const svgToCSS = (className : string, svgText: string) => {
    const dataURI = svg2DataURI(svgText)
    let cssText  = ''
        cssText = `i.icon-${className} {
    --svg: url("${dataURI}");
}`
    return cssText
}

const pngToCss = (className: string, pngText: string) => {
    return `i.icon-${className} {
    background-color: unset;
    background-image: url("${pngText}");
}`
}

let htmlContent = ''
const generateCSS = async (files: FileList) => {
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
}
    
i.color {
    background-color: unset;
    background-image: var(--svg);
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
                htmlContent += `<button class="icon-entry" data-icon="${iconName}" onclick="this.querySelector('i').classList.toggle('color')"><i class="icon-${iconName}" data-icon="${iconName}"></i><span data-icon="${iconName}">icon-${iconName}</span></button>`
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

const preview = ref(false)
let iconStyle: HTMLStyleElement | null = null
const previewCSS = (cssContent: string) => {
    if (iconStyle) {
        iconStyle.remove()
    }
    iconStyle = document.createElement('style')
    iconStyle.innerHTML = cssContent
    document.head.appendChild(iconStyle)

    preview.value = true
    nextTick(() => {
        let codeTextArea = document.querySelector('.code-area') as HTMLTextAreaElement
        if (codeTextArea) {
            codeTextArea.value = cssContent
        }
    })
}

const backToStep1 = () => {
    if (iconStyle) {
        iconStyle.remove()
    }
    iconStyle = null
    htmlContent = ''
    preview.value = false
}
</script>

<style scoped>
.previewer {
    @apply fixed top-0 left-0 w-full h-full bg-base-100 invisible opacity-0 transition-all duration-300;
}

.previewer.show {
    @apply opacity-100 visible;
}

.icon-grid :deep(.icon-entry) {
    @apply flex gap-2 items-center;
}

.icon-grid :deep(.icon-entry i) {
    @apply text-2xl shrink-0;
}

.icon-grid :deep(.icon-entry span) {
    @apply text-sm;
}
</style>