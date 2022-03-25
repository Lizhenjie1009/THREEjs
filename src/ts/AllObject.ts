import {
  Mesh,
  BoxBufferGeometry,
  MeshStandardMaterial,
  SphereBufferGeometry,
  CylinderBufferGeometry,
  Color,
  Scene,
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Line
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


export let moreSphere = (x: number, y: number, z: number = 20, scene: Scene) => {
  const sphere: Mesh = new Mesh(
    new SphereBufferGeometry(1),
    new MeshStandardMaterial({ color: 'rgb(244,155,255)' })
  )
  sphere.position.x = Math.random() > 0.5 ? Math.random() * 5 * x : -Math.random() * 5 * x
  sphere.position.y = Math.random() > 0.5 ? Math.random() * 6 * y + 10 : -Math.random() * 6 * y + 10
  sphere.position.z = Math.random() > 0.5 ? Math.random() * 2 * z : -Math.random() * 2 * z
  
  // 添加连线
  const points = [];
  points.push( new Vector3( sphere.position.x, sphere.position.y, sphere.position.z ) );
  points.push( new Vector3( -10, 0, 0 ) );
  // points.push( new Vector3( 10, 0, 0 ) );
  // points.push( new Vector3( 0, 10, 0 ) );
  const material = new LineBasicMaterial( { color: 0xa1f1af } );
  const geometry = new BufferGeometry().setFromPoints( points );
  const line = new Line( geometry, material );
  scene.add(line)

  sphere.addEventListener('mouseenter', e => (sphere.material as MeshStandardMaterial).color = new Color())
  sphere.addEventListener('mousemove', e => console.log('move'))
  sphere.addEventListener('mouseleave', e => (sphere.material as MeshStandardMaterial).color = new Color('rgb(144,255,255)'))

  return sphere
}


cyline.addEventListener('mouseenter', e => (cyline.material as MeshStandardMaterial).color = new Color('rgb(144,144,144)'))
cyline.addEventListener('mousemove', e => console.log('move'))
cyline.addEventListener('mouseleave', e => (cyline.material as MeshStandardMaterial).color = new Color())

