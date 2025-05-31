import { Slatebox } from '..././index';

Slatebox.base.registerPlugin({
  name: 'attempt',
  opts: {},
  plugin: class extends Slatebox.node {
    doAttempt() {
      console.log('HELLO NODE do I have inherited properties? ', this.disable);
    }
  },
});
