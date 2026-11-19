import { createElement as d } from "react";
import { createRoot as f } from "react-dom/client";
import { WorkshopBoard as h } from "./workshops.mjs";
import { dragologyCandidates as w } from "./workshops.mjs";
import { validateWorkshop as s } from "./workshop-model.mjs";
import { attachWorkshop as y } from "./workshop-model.mjs";
function C(p, i, t = {}) {
  let o = s(i), r = !1;
  const n = f(p);
  function a(e) {
    if (r) throw new Error("This workshop has been unmounted.");
    o = s(e), m();
  }
  function m() {
    n.render(d(h, {
      mapCanvas: !!o.lanes[0].station,
      ...t,
      value: o,
      onChange(e, u) {
        a(e), t.onChange?.(o, u);
      }
    }));
  }
  return m(), { update: a, destroy() {
    r || (r = !0, n.unmount());
  } };
}
export {
  y as attachWorkshop,
  w as dragologyCandidates,
  C as mountWorkshop
};
