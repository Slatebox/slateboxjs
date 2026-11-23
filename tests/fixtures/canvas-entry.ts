// slateboxjs/canvas as a page loads it: a read-only slate, drawn at once. ?overview=1 asks for the bird's-eye view;
// ?edit=1 makes the slate editable (a person can draw a line). ?entry=main draws the same slate with the main
// entry (slateboxjs), loaded only then, to compare what the two draw.
import sample from './sample-slate.json'

const query = new URLSearchParams(location.search)
const overview = query.get('overview') === '1', edit = query.get('edit') === '1'
const { Slate } = query.get('entry') === 'main' ? await import('../../src/index') : await import('../../src/canvas')
const slate = new Slate(document.getElementById('slate')!, {
  name: 'Canvas entry', enabled: edit, showMultiSelect: false, showUndoRedo: false, showZoom: false,
  viewPort: { showCoordinates: false }, panZoom: { enabled: false }, ...(edit ? {} : { events: { isReadOnly: () => true } }),
  ...(overview ? { birdsEye: { enabled: true } } : {}),
} as any)
;(window as any).slate = slate
slate.loadJSON(sample as any, false, true).then(() => {
  document.body.dataset.drawn = 'true'
})
