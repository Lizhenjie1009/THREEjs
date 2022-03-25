import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  Mesh, 
  BoxGeometry, 
  BoxBufferGeometry, 
  MeshStandardMaterial,
  Vector3,
  AmbientLight,
  AxesHelper,
  GridHelper,
  MOUSE,
  Object3D,
  Vector2,
  Raycaster,
  ObjectLoader,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
export class Engine {

  private dom: HTMLElement 
  private renderer: WebGLRenderer // 渲染器
  private scene: Scene // 场景
  private camera: PerspectiveCamera // 透视相机 -- 模拟人眼的视角
  private mouse: Vector2

  constructor (dom: HTMLElement) {
    this.dom = dom
    this.renderer = new WebGLRenderer({
      antialias: true 
    })
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000)
    this.camera.position.set(20,20,20)
    this.camera.lookAt(new Vector3(0,0,0))
    this.camera.up = new Vector3(0,1,0)

    this.mouse = new Vector2()
    
    // 设置大小
    // this.renderer.domElement.width = dom.offsetWidth
    // this.renderer.domElement.height = dom.offsetHeight
    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight, true)

    

    // 环境灯光
    const ambientLight: AmbientLight = new AmbientLight('rgb(255,255,255)', 1) 
    // 坐标轴
    const axesHelper: AxesHelper = new AxesHelper(500)
    // 网格
    const gridHelper: GridHelper = new GridHelper(500, 10, 'rgb(200,200,100)', 'rgb(100,200,200)')
    
    // 放入场景内
    this.scene.add(ambientLight)
    this.scene.add(axesHelper)
    this.scene.add(gridHelper)


    // 初始化性能监视器
    const stats = Stats()
    const statsDom = stats.domElement
    statsDom.style.position = 'fixed'
    statsDom.style.right = '5px'
    statsDom.style.top = '0px'
    statsDom.style.left = 'unset'

    // 初始轨道控制监控器
    const orbitControls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    // orbitControls.autoRotate = true // 自动旋转
    orbitControls.enableDamping = true // 阻力敢
    // orbitControls.mouseButtons = { // 自定义事件
    //   LEFT: null as unknown as MOUSE,
    //   MIDDLE: MOUSE.DOLLY,
    //   RIGHT: MOUSE.ROTATE
    // }

    // 追加canvas, 显示在页面
    dom.appendChild(this.renderer.domElement)
    dom.appendChild(statsDom)

    // 添加线
    // const points = [];
    // points.push( new Vector3( - 20, 0, 0 ) );
    // points.push( new Vector3( 0, 20, 0 ) );
    // points.push( new Vector3( 10, 0, 0 ) );
    // points.push( new Vector3( 0, 10, 0 ) );
    // const material = new LineBasicMaterial( { color: 0xff00ff } );
    // const geometry = new BufferGeometry().setFromPoints( points );
    // const line = new Line( geometry, material );
    // this.scene.add(line)


    // 射线发射器
    const raycaster: Raycaster = new Raycaster()
    // 变换控制器
    const transformControls: TransformControls = new TransformControls(this.camera, this.renderer.domElement)
    this.scene.add(transformControls)
    // let clickCancle = false // 点击事件冲突解决
    // transformControls.addEventListener('mouseDown', e => {
    //   console.log(e, 11111);
    //   clickCancle = true
    // })
    // transformControls.addEventListener('mouseUp', e => {
    //   console.log(e, 22222);
    //   // clickCancle = true
    // })
    
    // const mouse = new Vector2()
    let x = 0
    let y = 0
    let width = 0
    let height = 0
    let cacheObject: Object3D | null = null
    this.renderer.domElement.addEventListener('click', (e) => {
      // if (clickCancle) clickCancle = false
      e.preventDefault()
      x = e.offsetX
      y = e.offsetY
      width = this.renderer.domElement.offsetWidth
      height = this.renderer.domElement.offsetHeight
      this.mouse.x = x / width *2 - 1
      this.mouse.y = -y * 2 / height + 1
      console.log(this.mouse.x, this.mouse.y);
      raycaster.setFromCamera(this.mouse, this.camera)

      // 解决选中transform
      this.scene.remove(transformControls)
      const intersection = raycaster.intersectObjects(this.scene.children)
      this.scene.add(transformControls)

      if (intersection.length) {
        console.log(intersection);
        const obj = intersection[0].object
        transformControls.attach(obj)

        if (cacheObject !== obj) {
          if (cacheObject) {
            cacheObject.dispatchEvent({ type: 'mouseleave' })
          }
          obj.dispatchEvent({ type: 'mouseenter' })
        } else if (cacheObject === obj) {
          obj.dispatchEvent({ type: 'mousemove' })
        }
        cacheObject = obj
      } else {
        if (cacheObject) {
          cacheObject.dispatchEvent({ type: 'mouseleave' })
        }
        cacheObject = null
      }
    })

    // 自定义变换
    document.addEventListener('keydown', e => {
      console.log(e);
      if (e.key === 'r') {
        transformControls.mode = 'rotate'
      } else if (e.key === 'e') {
        transformControls.mode = 'scale'
      } else if (e.key === 't') {
        transformControls.mode = 'translate'
      }
      
    })

    
    // this.renderer.setClearColor('rgba(255,255,255)')
    // this.renderer.clearColor()
    // 渲染 
    // this.renderer.render(this.scene, this.camera) 
    // 动画
    const animate = () => {
      // box.position.z += 0.01
      // this.camera.position.x -= 0.02
      orbitControls.update()
      this.renderer.render(this.scene, this.camera) 
      stats.update()
      requestAnimationFrame(animate)
    }

    animate()
  }

  addObject (...object: Object3D[]) {
    object.forEach(ele => this.scene.add(ele))
  }

  exportJson () {
    const sceneJson = JSON.stringify(this.scene.toJSON())
    localStorage.setItem('scene', sceneJson);
  }

  clearScene () {
    this.scene = new Scene();
  }

  importScene () {
    var json = localStorage.getItem("scene");
    if (json) {
      var loadedGeometry = JSON.parse(json);
      var loader = new ObjectLoader();
      this.scene = loader.parse(loadedGeometry);

      // 坐标轴
      const axesHelper: AxesHelper = new AxesHelper(500)
      // 网格
      const gridHelper: GridHelper = new GridHelper(500, 10, 'rgb(200,200,100)', 'rgb(100,200,200)')
      // 放入场景内
      this.scene.add(axesHelper)
      this.scene.add(gridHelper)

      // 射线发射器
      const raycaster: Raycaster = new Raycaster()
      // 变换控制器
      const transformControls: TransformControls = new TransformControls(this.camera, this.renderer.domElement)
      this.scene.add(transformControls)
      
      // const mouse = new Vector2()
      let x = 0
      let y = 0
      let width = 0
      let height = 0
      this.renderer.domElement.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        x = e.offsetX
        y = e.offsetY
        width = this.renderer.domElement.offsetWidth
        height = this.renderer.domElement.offsetHeight
        this.mouse.x = x / width *2 - 1
        this.mouse.y = -y * 2 / height + 1
        console.log(this.mouse.x, this.mouse.y);
        raycaster.setFromCamera(this.mouse, this.camera)
        const intersection = raycaster.intersectObjects(this.scene.children)
        if (intersection.length) {
          console.log(intersection);
          const obj = intersection[0].object
          transformControls.attach(obj)
        }
      })
    }
  }
}