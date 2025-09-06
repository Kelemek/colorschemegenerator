const getColorPicker = document.getElementById("color-picker")
const getModeSelect = document.getElementById("mode-select")
const getColorSchemeBtn = document.getElementById("getscheme-button")
const main = document.getElementById("main")

async function getColorScheme(color, mode) {
    try {
        const res = await fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}&count=5`)
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        const data = await res.json()
        return data
    } catch(err) {
        console.error(err.message)
    }
}

getColorSchemeBtn.addEventListener("click", async function() {
    const colorScheme = await getColorScheme(getColorPicker.value.replace(/^#/, ''), getModeSelect.value)
    renderColors(colorScheme)
})

function renderColors(colorScheme){
    let returnHtml = ""
    for (const color of colorScheme.colors) {
        returnHtml += `
        <div class="container">
            <div class="color-div" data-hex="${color.hex.value}">
                <img src="${color.image.bare}" data-hex="${color.hex.value}" alt="Color ${color.name.value}">
            </div>
            <div class="color-code">
                <span class="hex-text" data-hex="${color.hex.value}">${color.hex.value}</span>
                <span class="hex-text" data-hex="${color.hex.value}">${color.name.value}</span>
            </div>
        </div>
        `
    }
    main.innerHTML = returnHtml

    main.querySelectorAll('.color-div, .hex-text').forEach(el => {
        // Show 'Click to copy' tooltip on hover
        el.addEventListener('mouseenter', function(e) {
            const hex = el.getAttribute('data-hex')
            if (hex) {
                const hoverTip = document.createElement('div')
                hoverTip.textContent = 'Click to copy hex'
                hoverTip.className = 'hover-tip'
                hoverTip.style.position = 'fixed'
                hoverTip.style.left = e.clientX + 'px'
                hoverTip.style.top = (e.clientY + 20) + 'px'
                hoverTip.style.background = 'rgba(30,30,30,0.95)'
                hoverTip.style.color = '#fff'
                hoverTip.style.padding = '4px 10px'
                hoverTip.style.borderRadius = '6px'
                hoverTip.style.fontSize = '.75em'
                hoverTip.style.zIndex = 1000
                hoverTip.style.pointerEvents = 'none'
                document.body.appendChild(hoverTip)
                el._hoverTip = hoverTip
            }
        })
        el.addEventListener('mouseleave', function() {
            if (el._hoverTip) {
                el._hoverTip.remove()
                el._hoverTip = null
            }
        })
        el.addEventListener('mousemove', function(e) {
            if (el._hoverTip) {
                el._hoverTip.style.left = e.clientX + 'px'
                el._hoverTip.style.top = (e.clientY + 20) + 'px'
            }
        })
        // Show 'Copied to clipboard' tooltip on click
        el.addEventListener('click', function(e) {
            const hex = el.getAttribute('data-hex')
            if (hex) {
                navigator.clipboard.writeText(hex)
                if (el._hoverTip) {
                    el._hoverTip.remove()
                    el._hoverTip = null
                }
                const tooltip = document.createElement('div')
                tooltip.textContent = 'Copied to clipboard'
                tooltip.style.position = 'fixed'
                tooltip.style.left = e.clientX + 'px'
                tooltip.style.top = (e.clientY + 20) + 'px'
                tooltip.style.background = 'rgba(30,30,30,0.95)'
                tooltip.style.color = '#fff'
                tooltip.style.padding = '4px 10px'
                tooltip.style.borderRadius = '6px'
                tooltip.style.fontSize = '.75em'
                tooltip.style.zIndex = 1000
                tooltip.style.pointerEvents = 'none'
                document.body.appendChild(tooltip)
                setTimeout(() => {
                    tooltip.remove()
                }, 2000)
            }
        })
    })
}
