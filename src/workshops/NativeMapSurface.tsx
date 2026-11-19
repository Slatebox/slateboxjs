import React, { useLayoutEffect, useRef } from 'react'
import { Slate } from '../index'
import type { fitLaneLayout } from './fitLanes'
import { compactStationGap } from './fitLanes'
import { workshopLayout, workshopPositions, workshopToSlate, type Workshop } from './model'

/** Use the same responsive world coordinates as Dragology's station and token hit targets. */
function compactMapDocument(board: Workshop, fitted?: ReturnType<typeof fitLaneLayout>) {
  const doc = workshopToSlate(board)
  const layout = fitted?.layout ?? workshopLayout
  const {points} = workshopPositions(board,layout,compactStationGap)
  const byId = new Map(doc.nodes.map(node => [node.options.id,node]))
  const visible = []
  for (const [column,lane] of board.lanes.entries()) {
    const point = points[column]
    const heading = byId.get('lane-'+lane.id)!
    Object.assign(heading.options,{
      xPos:point.x+8,yPos:point.y+4,width:layout.width,height:layout.top-12,
      text:(fitted?.labels.get('heading-'+lane.id) ?? [lane.label]).join('\n'),
      fontSize:14,backgroundColor:'#edf4ee',foregroundColor:'#263e34',borderColor:'#9ab3a0',
      allowDrag:false,
    })
    visible.push(heading)
    for (const [row,card] of board.cards.filter(c => c.laneId===lane.id).entries()) {
      const node = byId.get('card-'+card.id)!
      Object.assign(node.options,{
        xPos:point.x+18,yPos:point.y+layout.top+row*layout.row,width:layout.width-20,height:layout.height-6,
        text:(fitted?.labels.get('choice-'+card.id) ?? [card.label]).join('\n'),
        fontSize:14,backgroundColor:'#ffda75',foregroundColor:'#293629',borderColor:'#8e814a',allowDrag:false,
      })
      visible.push(node)
    }
  }
  return {...doc,nodes:visible}
}

export function NativeMapSurface({board,fitted,width,height,children}:{
  board:Workshop; fitted?:ReturnType<typeof fitLaneLayout>; width:number; height:number; children:React.ReactNode
}) {
  const artwork = useRef<HTMLDivElement>(null)
  const hits = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const host = artwork.current!, hit = hits.current!
    host.setAttribute('inert','')
    const surface = document.createElement('div')
    surface.style.cssText = 'width:100%;height:100%'
    host.appendChild(surface)
    const slate = new Slate(surface,{name:board.title,enabled:false,showUndoRedo:false,showMultiSelect:false,
      viewPort:{originalWidth:width,originalHeight:height,showCoordinates:false},
      panZoom:{enabled:false},autoResizeNodesBasedOnText:false})
    const svg = slate.canvas.node as SVGSVGElement
    svg.removeAttribute('tabindex')
    let mounted = true, frame = 0
    let ready = false
    const paint = () => {
      frame = 0
      if (!ready) return
      const camera = svg.getScreenCTM()
      if (!camera) return
      const inverse = camera.inverse()
      // Dragology owns pointer tracking, candidate placement and legal drops. Its
      // animated transforms position the real Slate nodes, including while held.
      for (const target of hit.querySelectorAll<SVGGElement>('[data-workshop-card]')) {
        const matrix = target.getScreenCTM()
        const node = slate.nodes.one('card-'+target.dataset.workshopCard)
        if (!matrix || !node) continue
        const point = new DOMPoint(matrix.e,matrix.f).matrixTransform(inverse)
        if (Math.abs(point.x-(node.options.x ?? 0)) > .1 || Math.abs(point.y-(node.options.y ?? 0)) > .1) {
          node.position(point.x,point.y)
        }
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint) }
    const observer = new MutationObserver(schedule)
    observer.observe(hit,{subtree:true,childList:true,attributes:true,attributeFilter:['transform','style']})
    const loaded = slate.loadJSON(compactMapDocument(board,fitted),false,true).then(() => {
      if (!mounted) return
      ready = true
      schedule()
    })
    const focus = (event:FocusEvent) => {
      const target = (event.target as Element)?.closest<SVGGElement>('[data-workshop-station],[data-workshop-card]')
      const id = target?.dataset.workshopStation ? 'lane-'+target.dataset.workshopStation :
        target?.dataset.workshopCard ? 'card-'+target.dataset.workshopCard : ''
      const node = slate.nodes.one(id)?.svgGroup?.node
      if (node) node.style.outline = event.type === 'focusin' ? '2px solid #305d99' : ''
    }
    hit.addEventListener('focusin',focus)
    hit.addEventListener('focusout',focus)
    return () => {
      mounted = false
      observer.disconnect()
      cancelAnimationFrame(frame)
      hit.removeEventListener('focusin',focus)
      hit.removeEventListener('focusout',focus)
      surface.remove()
      // Native node art is initialized asynchronously. Retire the detached
      // instance once its own load finishes, including on a rapid model update.
      void loaded.finally(() => slate.destroy())
    }
  }, [board,fitted,width,height])
  return <div style={{position:'relative',width,height,marginInline:'auto',isolation:'isolate'}}>
    <div ref={artwork} data-native-workshop-map="" aria-hidden="true"
      style={{position:'absolute',inset:0,pointerEvents:'none'}} />
    <div ref={hits} data-workshop-hit-surface="" style={{position:'absolute',inset:0,opacity:0}}>{children}</div>
  </div>
}
