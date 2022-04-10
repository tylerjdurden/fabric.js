fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Checks if object is decendant of target
   * Should be used instead of @link {fabric.Collection.contains} for performance reasons
   * @param {fabric.Object|fabric.StaticCanvas} target
   * @returns {boolean}
   */
  isDescendantOf: function (target) {
    var parent = this.group || this.canvas;
    while (parent) {
      if (target === parent) {
        return true;
      }
      else if (parent instanceof fabric.StaticCanvas) {
        //  happens after all parents were traversed through without a match
        return false;
      }
      parent = parent.group || parent.canvas;
    }
    return false;
  },

  /**
   *
   * @typedef {fabric.Object[] | [...fabric.Object[], fabric.StaticCanvas]} Ancestors
   * 
   * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
   * @returns {Ancestors} ancestors from bottom to top
   */
  getAncestors: function (strict) {
    var ancestors = [];
    var parent = this.group || (strict ? undefined : this.canvas);
    while (parent) {
      ancestors.push(parent);
      parent = parent.group || (strict ? undefined : parent.canvas);
    }
    return ancestors;
  },

  /**
   *
   * @param {fabric.Object} other
   * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
   * @returns {{ index: number, otherIndex: number, ancestors: Ancestors } | undefined} ancestors may include the passed objects if one is an ancestor of the other resulting in index of -1
   */
  findCommonAncestors: function (other, strict) {
    if (this === other) {
      return {
        index: 0,
        otherIndex: 0,
        ancestors: this.getAncestors(strict)
      };
    }
    else if (!other) {
      return undefined;
    }
    var ancestors = this.getAncestors(strict);
    ancestors.unshift(this);
    var otherAncestors = other.getAncestors(strict);
    otherAncestors.unshift(other);
    for (var i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      for (var j = 0; j < otherAncestors.length; j++) {
        if (ancestor === otherAncestors[j]) {
          return {
            index: i - 1,
            otherIndex: j - 1,
            ancestors: ancestors.slice(i)
          };
        }
      }
    }
  },

  /**
   *
   * @param {fabric.Object} other
   * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
   * @returns {boolean}
   */
  hasCommonAncestors: function (other, strict) {
    return !!this.findCommonAncestors(other, strict);
  }
});
