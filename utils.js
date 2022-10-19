const createShader = (gl, type, src)  => {

  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  const didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (didCompile) {
    return shader
  }
  else {
    console.warn( gl.getShaderInfoLog(shader) )
  }

}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var didLink = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (didLink) {
    return program;
  }
  
  console.warn(gl.getProgramInfoLog(program));

  gl.deleteProgram(program);
  
}

export {
  createShader,
  createProgram
}