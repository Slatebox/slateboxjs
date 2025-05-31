import { Slatebox } from '..././index';

Slatebox.base.registerPlugin({
  name: 'attempt',
  opts: {},
  plugin: class extends Slatebox.slate {
    doSecond() {
      console.log('SLATE hello do I have inherited properties? ', this);
    }
  },
});
