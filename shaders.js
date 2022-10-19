const vert = /*GLSL*/`
  attribute vec2 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  void main() {
    gl_Position = vec4(aPosition, 1., 1.);

    gl_PointSize = 10.;

    vTexCoord = aTexCoord;
  }
` 

const frag = /*GLSL*/`
  precision highp float;

  uniform sampler2D tTex;
  uniform float uTime;

  varying vec2 vTexCoord;

  void main() {

    vec2 coord = vTexCoord;
    
    // soluce
    // float ratio = 256./512.;
    // coord = vTexCoord * vec2(1./ratio, 1.);
    
    vec3 color = texture2D(tTex, coord).rgb;

    // color += vec3(coord, 0.);

    gl_FragColor = vec4(color, 1.);
  }
`

export {
  vert,
  frag
}