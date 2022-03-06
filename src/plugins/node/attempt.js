import { Slatebox } from '../../index.js';

Slatebox.base.registerPlugin({
    name: "attempt"
  , opts: {}
  , plugin: class extends Slatebox.node {
    doAttempt() {
      console.log("HELLO NODE do I have inherited properties? ", this.disable);
    }
  }
});