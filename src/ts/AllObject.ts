import {
  Mesh,
  BoxBufferGeometry,
  MeshStandardMaterial,
  SphereBufferGeometry,
  CylinderBufferGeometry
} from 'three'

// 网格材质
export const box: Mesh = new Mesh( // 网格物体
  new BoxBufferGeometry(10,10,10), // 几何对象
  new MeshStandardMaterial({ color: 'rgb(255,255,0)' }) // 网格标准材质
)
box.position.x = 10

export const sphere: Mesh = new Mesh(
  new SphereBufferGeometry(1),
  new MeshStandardMaterial({ color: 'rgb(144,255,0)' })
)
sphere.position.x = -10


export const cyline: Mesh = new Mesh(
  new CylinderBufferGeometry(5,5,10,32,5),
  new MeshStandardMaterial()
)
cyline.position.x = -20

export let moreSphere = (x: number, y: number) => {
  const sphere: Mesh = new Mesh(
    new SphereBufferGeometry(1),
    new MeshStandardMaterial({ color: 'rgb(144,255,0)' })
  )
  sphere.position.x = x
  sphere.position.y = y
  return sphere
}
