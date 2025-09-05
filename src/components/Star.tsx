import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, AdditiveBlending, CanvasTexture, Sprite } from "three"
import type { Memory } from "../types"
import { emotionColors } from "../utils/emotionColors"

type Props = {
  memory: Memory
  onSelect: (id: string) => void
}

export default function Star({ memory, onSelect }: Props) {
  const ref = useRef<Group>(null!)

  // Анимация вращения + дыхания ауры
  const tRef = useRef(0)
  useFrame((_state: unknown, delta: number) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
    tRef.current += delta
  })

  const color = emotionColors[memory.emotion]

  // создание градиентной текстуры для мягкой ауры
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!

    const grd = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    )
    // центр яркий, по краям прозрачный
    grd.addColorStop(0, `rgba(255,255,255,1)`)
    grd.addColorStop(0.2, `${color}`)
    grd.addColorStop(1, `rgba(0,0,0,0)`)

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, size, size)

    const tex = new CanvasTexture(canvas)
    tex.needsUpdate = true
    tex.generateMipmaps = true
    return tex
  }, [color])

  // очистка текстуры при размонтировании
  useEffect(() => {
    return () => {
      if ((texture as CanvasTexture).dispose)
        (texture as CanvasTexture).dispose()
    }
  }, [texture])

  // масштаб дыхания применяется в петле кадра
  const phaseBase =
    (memory.position[0] + memory.position[1] + memory.position[2]) * 0.05

  useFrame(() => {
    if (!ref.current) return
    const phase = phaseBase
    const pulse = 1 + Math.sin(tRef.current * 2.0 + phase) * 0.12
    // спрайт — первый дочерний элемент
    const spr = ref.current.children[0] as unknown as Sprite
    if (spr?.scale) spr.scale.set(0.9 * pulse, 0.9 * pulse, 1)
  })

  return (
    <group
      ref={ref}
      position={memory.position}
      onClick={() => onSelect(memory.id)}
    >
      <sprite>
        <spriteMaterial
          map={texture}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
          opacity={0.9}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}
