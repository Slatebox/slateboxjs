export default class links {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this.node.link.click((e) => {
      this.click()
    })
  }

  set(pkg, sendCollab) {
    // {
    //   type: 'url|currentSlate|externalSlate',
    //   data: 'https://xxx|id_of_node'
    // }
    this.node.options.link = pkg
    if (sendCollab) {
      const cpkg = {
        type: 'onNodeLinkAdded',
        data: pkg,
      }
      if (this.slate.collab) this.slate.collab.send(cpkg)
    }
  }

  unset(sendCollab) {
    this.node.options.link = null
    if (sendCollab) {
      const cpkg = {
        type: 'onNodeLinkRemoved',
        data: pkg,
      }
      if (this.slate.collab) this.slate.collab.send(cpkg)
    }
  }

  click() {
    //`url("https://api.miniature.io/?token=ozwPwKuD6CYUiE9K&url=miniature.io?url=${_self._.options.link.data}&size=200")`
    const self = this
    switch (this.node.options.link.type) {
      case 'url': {
        window.open(self.node.options.link.data, 'sb_external')
        break
      }
      case 'externalSlate': {
        break
      }
      case 'currentSlate': {
        const n = self.slate.nodes.one(self.node.options.link.data)
        n.position(
          'center',
          () => {
            // done
          },
          'swingTo',
          500
        )
        break
      }
    }
  }
}
