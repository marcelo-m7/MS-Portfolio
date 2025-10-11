import * as THREE from 'three';
import { face_vert, line_vert, mouse_vert } from './shaders';

export function makePaletteTexture(stops: string[]): THREE.DataTexture {
  let arr: string[];
  if (Array.isArray(stops) && stops.length > 0) {
    if (stops.length === 1) {
      arr = [stops[0], stops[0]];
    } else {
      arr = stops;
    }
  } else {
    arr = ['#ffffff', '#ffffff'];
  }
  const w = arr.length;
  const data = new Uint8Array(w * 4);
  for (let i = 0; i < w; i++) {
    const c = new THREE.Color(arr[i]);
    data[i * 4 + 0] = Math.round(c.r * 255);
    data[i * 4 + 1] = Math.round(c.g * 255);
    data[i * 4 + 2] = Math.round(c.b * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export function getFloatType(): THREE.TextureDataType {
  const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
  return isIOS ? THREE.HalfFloatType : THREE.FloatType;
}

export function createFBO(width: number, height: number, type: THREE.TextureDataType): THREE.WebGLRenderTarget {
  const opts = {
    type,
    depthBuffer: false,
    stencilBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  };
  return new THREE.WebGLRenderTarget(width, height, opts);
}

export function createShaderMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: any,
  blending: THREE.Blending = THREE.NormalBlending,
  depthWrite: boolean = true,
  transparent: boolean = false,
): THREE.RawShaderMaterial {
  return new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    blending,
    depthWrite,
    transparent,
  });
}

export function createFullScreenQuad(material: THREE.RawShaderMaterial): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(2.0, 2.0);
  return new THREE.Mesh(geometry, material);
}

export function createBoundaryLine(uniforms: any): THREE.LineSegments {
  const boundaryG = new THREE.BufferGeometry();
  const vertices_boundary = new Float32Array([
    -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0,
  ]);
  boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3));
  const boundaryM = createShaderMaterial(line_vert, uniforms.fragmentShader, uniforms); // Reusing advection_frag uniforms
  return new THREE.LineSegments(boundaryG, boundaryM);
}

export function createMouseMesh(simProps: any, fragmentShader: string): THREE.Mesh {
  const mouseG = new THREE.PlaneGeometry(1, 1);
  const mouseM = createShaderMaterial(
    mouse_vert,
    fragmentShader,
    {
      px: { value: simProps.cellScale },
      force: { value: new THREE.Vector2(0.0, 0.0) },
      center: { value: new THREE.Vector2(0.0, 0.0) },
      scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) },
    },
    THREE.AdditiveBlending,
    false,
    true,
  );
  return new THREE.Mesh(mouseG, mouseM);
}