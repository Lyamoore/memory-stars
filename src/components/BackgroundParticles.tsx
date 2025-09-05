import { useMemo, useRef } from "react"
import { Points, PointMaterial } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

export default function BackgroundParticles() {
  const ref = useRef<unknown>(null)

  // генерация статичных частиц детерминированно 2000 штук
  const particles = useMemo(() => {
    const count = 2000
    const arr = new Float32Array(count * 3)

    // простой LCG, чтобы не дергать Math.random в рендере
    let seed = 123456
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < count * 3; i++) {
      arr[i] = (rand() - 0.5) * 40 // большой радиус галактики
    }

    return arr
  }, [])

  useFrame((_state: unknown, delta: number) => {
    if (ref.current) {
      const g = ref.current as { rotation: { x: number; y: number } }
      g.rotation.y += delta * 0.03
      g.rotation.x += delta * 0.01
    }
  })

  return (
    <group>
      <Points ref={ref} positions={particles} stride={3}>
        <PointMaterial
          transparent
          size={0.015}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
          color={"#ffffff"}
        />
      </Points>
    </group>
  )
}
