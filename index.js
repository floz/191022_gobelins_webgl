import { vert, frag } from "./shaders.js"
import { createProgram, createShader } from "./utils.js"

let size = 512

let cvs = null 
let gl = null 

let vShader = null
let fShader = null
let program = null

// attribute
let positionAttribLocation = null
let texCoordAttribLocation = null 

// uniforms
let tTexUniformLocation = null
let timeUniformLocation = null

// buffers
let buffer = null

let texture = null

let time = 0

const NB_GEOM = 1

const loadTexture = () => {
  texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE

  const view = new Uint8Array([255, 0, 0, 255])
  
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, view)

  gl.bindTexture(gl.TEXTURE_2D, null)


  const img = new Image
  img.onload = () => {
    
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, img)

    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.generateMipmap(gl.TEXTURE_2D);


    onFrame()

  }
  img.src = './mimi_256-512.jpg'
}

const setupCanvas = () => {

  // create canvas
  cvs = document.createElement('canvas')
  cvs.style.width = `${size}px`
  cvs.style.height = `${size}px`
  cvs.width = size
  cvs.height = size
  cvs.style.position = 'absolute'
  cvs.style.left = `${size/2}px`
  cvs.width = size 
  cvs.height = size 
  
  // get context
  gl = cvs.getContext('webgl')
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


  document.body.appendChild(cvs)

}

const setupProgram = () => {
  vShader = createShader(gl, gl.VERTEX_SHADER, vert)
  fShader = createShader(gl, gl.FRAGMENT_SHADER, frag)
  program = createProgram(gl, vShader, fShader)

}

const getTriangleData = () => {

  const data = []
  for (let i = 0; i < 3; i++) {
    const color = [ Math.random(), Math.random(), Math.random() ]
    data.push(
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
    )
  }
  
  return data
}

const getRectData = () => {

  /*
  -1,1 .____. 1,1
       |   /|
       |  / | 
       | /  | 
  -1,1 ./___. 1,-1
  */
  const scl = 1//Math.random()
  const data = [
    // first
    -scl, -scl, 0, 0, // x, y, u, v
    -scl,  scl, 0, 1,
     scl,  scl, 1, 1,

     // second
    -scl, -scl, 0, 0,
     scl,  scl, 1, 1,
     scl, -scl, 1, 0
  ]
  return data
}
 
const setupData = () => {
  // attrib memory location
  positionAttribLocation = gl.getAttribLocation(program, 'aPosition')
  texCoordAttribLocation = gl.getAttribLocation(program, 'aTexCoord')

  // uniforms
  tTexUniformLocation = gl.getUniformLocation(program, 'tTex')
  timeUniformLocation = gl.getUniformLocation(program, 'uTime')

  // buffer (geometry)
  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // data
  let data = []
  for (let i = 0; i < NB_GEOM; i++) {
    const geomData = getRectData()
    data = data.concat(geomData)
  }
  const bufferData = new Float32Array(data)

  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

const update = () => {

  time += 0.0016

}

const render = () => {
  gl.viewport(0, 0, size, size)

  // clear before drawing
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // bind the shader to use
  gl.useProgram(program)
  gl.uniform1f(timeUniformLocation, time)



  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(tTexUniformLocation, 0);





  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // bind data for that buffer
  gl.enableVertexAttribArray(positionAttribLocation)
  gl.enableVertexAttribArray(texCoordAttribLocation)

  // tell the buffer how to use the data
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 16, 0)
  gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 16, 8)

  gl.drawArrays(gl.TRIANGLES, 0, 6 * NB_GEOM)

}

const onFrame = () => {

  requestAnimationFrame(onFrame)

  update()
  render()

}

setupCanvas()
setupProgram()
setupData()
loadTexture()