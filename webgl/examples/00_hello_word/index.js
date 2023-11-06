function main() {
  var canvas = document.querySelector("#c");

  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("你不能使用WebGL！");
    return;
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  var vertexShaderSource = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;
 
  // all shaders have a main function
  void main() {
 
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`;

  var fragmentShaderSource = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
}
`;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  // 创建着色程序
  var program = createProgram(gl, vertexShader, fragmentShader);

  // 获取属性位置应始终在初始化时进行（而不是渲染循环中）
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // 创建buffer
  var positionBuffer = gl.createBuffer();

  // 绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 向buffer中添加数据
  var positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // 渲染（使用webgl工具库）
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // set viewport map
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 使用着色程序
  gl.useProgram(program);

  // 使用属性位置
  gl.enableVertexAttribArray(positionAttributeLocation);

  // 告诉属性如何从buffer中读取数据 (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // 绘制
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();
