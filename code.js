const initialModalSize = {
  width: 600,
  height: 400
}

figma.showUI(__html__, initialModalSize)

const compareByX = (a, b) => {
  if (a.x > b.x) return 1
  if (b.x > a.x) return -1
  return 0
}
const compareByY = (a, b) => {
  if (a.y > b.y) return 1
  if (b.y > a.y) return -1
  return 0
}

figma.ui.onmessage = msg => {
  if (msg === "export") {
    let selections = [], dir, oX, oY, margins = [0], cumX = 0, cumY = 0
    let sels = Array.from(figma.currentPage.selection)
    sels.sort(compareByX).sort(compareByY) // The ordering of nodes in figma.currentPage.selection is not guaranteed, so guarantee it
    for (const i in sels) {
      const node = sels[i]

      // Coords within NxN canvas
      let xDiff = (node.height - node.width) / 2
      let yDiff = (node.width - node.height) / 2

      // Neutralise negligible values
      if (xDiff > -0.001 && 0.001 > xDiff) xDiff = 0
      if (yDiff > -0.001 && 0.001 > yDiff) yDiff = 0

      // Origin of entire selection
      if (i == 0) {
        oX = node.x
        oY = node.y
      }
      
      // Relative coords within selection
      let x = node.x - oX
      if (xDiff > 0) x = x - xDiff
      let y = node.y - oY - yDiff
      if (yDiff > 0) y = y - yDiff
      
      // Calculate Tailwind margins
      if (i > 0) {
        if (! dir) {
          dir = (node.y - sels[i-1].y) < 5 ? 'x' : 'y' // check if icon is inline with previous icon on y-axis, allowing a tolerance of 5
        }
        if (dir == 'x') {
          margins[i] = Math.abs(Math.round(x - cumX - sels[i].width))
        } else {
          margins[i] = Math.abs(Math.round(y - cumY - sels[i].height))
        }
        cumX += x
        cumY += y
      }

      let fill = 'transparent'
      let isRgb = ! isNaN(parseFloat(node.fills[0].color.r))
      if (isRgb) {
        fill = `rgba(${parseInt(node.fills[0].color.r * 255, 10)}, ${parseInt(node.fills[0].color.g * 255, 10)}, ${parseInt(node.fills[0].color.b * 255, 10)})`
      }
      let largerDim = parseInt(Math.max(node.width, node.height), 10)
      let svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="${largerDim}px" height="${largerDim}px" fill="${fill}" viewBox="0 0 ${largerDim} ${largerDim}" enable-background="new 0 0 ${largerDim} ${largerDim}0" xml:space="preserve">`
      if (node.width > node.height) {
        svg += `
  <g transform="matrix(1,0,0,1,0,${yDiff})">`
      } else if (node.height > node.width) {
        svg += `
  <g transform="matrix(1,0,0,1,${xDiff},0)">`
      }
      node.vectorPaths.forEach(path => {
        svg += `
    <path d="${path.data}"/>
`
      })
      if (node.width != node.height) {
        svg += `
  </g>`
      }
      svg += `
</svg>`
      selections.push({
        name: node.name,
        svg: svg
      })
    }

    figma.ui.postMessage({
      type: "selections",
      selections: selections,
      dir: dir,
      margins: margins
    })
  }
}

// figma.ui.onmessage = msg => {
//   const setProperHeight = () =>
//     figma.ui.resize(initialModalSize.width, msg.innerHeight + 65 || initialModalSize.height)

//   if (msg.type === 'init') {
//     message.counter = frames.length.toString()
//     figma.ui.postMessage(message)
//   }

//   if (msg.type === 'generate') {
//     if (framesOrComponentsWithChildren) {
//       framesOrComponentsWithChildren.forEach(frame => {
//         // prevent TS errors
//         if (frame.type !== 'FRAME' && frame.type !== 'COMPONENT' && frame.type !== 'INSTANCE') {
//           return
//         }

//         const child = frame.children[0]

//         // Handle errors
//         if (frame.children.length > 1 || child.type !== 'VECTOR') {
//           iconNamesWithError.push(frame.name)
//         }

//         // prevent TS errors
//         if (child.type !== 'VECTOR') {
//           return
//         }

//         const name = frame.name
//         const paths = child.vectorPaths.map(path => ({
//           ...path,
//           windingRule: path.windingRule.toLowerCase(),
//         }))
//         const size = {
//           width: child.width,
//           height: child.height,
//         }
//         const viewBox = `0 0 ${frame.width} ${frame.height}`
//         const translate = {
//           x: child.x,
//           y: child.y,
//         }
//         const fills = child.fills[0]
//         let fill = null

//         if (fills) {
//           const { r, g, b } = fills.color
//           const { opacity } = fills
//           const rgb = tinycolor2.fromRatio({ r, g, b }).setAlpha(opacity)
//           fill = {
//             rgb: rgb.toRgbString(),
//             hsl: rgb.toHslString(),
//             hex: rgb.toHex8String(),
//           }
//         }

//         // Handle errors
//         if (icons[name]) {
//           iconsWithSameName.push(name)
//         }

//         icons[name] = {
//           name,
//           paths,
//           size,
//           fill,
//           viewBox,
//           translate,
//         }
//       })

//       // Handle errors
//       if (emptyFramesOrComponents.length) {
//         message.errorFrames = emptyFramesOrComponents
//         figma.ui.postMessage(message)

//         return
//       }

//       // Handle errors
//       if (iconNamesWithError.length) {
//         message.errorIcons = iconNamesWithError
//         figma.ui.postMessage(message)

//         return
//       }

//       // Handle errors
//       if (iconsWithSameName.length) {
//         message.errorNames = iconsWithSameName
//         figma.ui.postMessage(message)

//         return
//       }

//       message.icons = JSON.stringify(icons, null, 2)
//       figma.ui.postMessage(message)
//     }
//   }

//   setProperHeight()

//   if (msg.type === 'cancel') {
//     figma.closePlugin()
//   }
// }
