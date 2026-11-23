import { createElement as d } from "react";
import { createRoot as f } from "react-dom/client";
import { WorkshopBoard as h } from "./workshops.mjs";
import { dragologyCandidates as w } from "./workshops.mjs";
import { v as m } from "./model-BFVoEcaZ.mjs";
import { g as y } from "./model-BFVoEcaZ.mjs";
function v(p, i, t = {}) {
  let o = m(i), r = !1;
  const n = f(p);
  function a(e) {
    if (r) throw new Error("This workshop has been unmounted.");
    o = m(e), s();
  }
  function s() {
    n.render(d(h, {
      mapCanvas: !!o.lanes[0].station,
      ...t,
      value: o,
      onChange(e, u) {
        a(e), t.onChange?.(o, u);
      }
    }));
  }
  return s(), { update: a, destroy() {
    r || (r = !0, n.unmount());
  } };
}
export {
  y as attachWorkshop,
  w as dragologyCandidates,
  v as mountWorkshop
};
