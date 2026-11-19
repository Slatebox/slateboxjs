import { createElement as f } from "react";
import { createRoot as d } from "react-dom/client";
import { WorkshopBoard as h } from "./workshops.mjs";
import { validateWorkshop as s } from "./workshop-model.mjs";
function w(u, i, t = {}) {
  let o = s(i), r = !1;
  const n = d(u);
  function a(e) {
    if (r) throw new Error("This workshop has been unmounted.");
    o = s(e), m();
  }
  function m() {
    n.render(f(h, {
      mapCanvas: !!o.lanes[0].station,
      ...t,
      value: o,
      onChange(e, p) {
        a(e), t.onChange?.(o, p);
      }
    }));
  }
  return m(), { update: a, destroy() {
    r || (r = !0, n.unmount());
  } };
}
export {
  w as mountWorkshop
};
